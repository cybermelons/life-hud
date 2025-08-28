# Data Model Architecture - Kama Battle MVP

## Core Design Principles

1. **NUTs can be individually marked klesha** - Users mark arbitrary pain points throughout their day
2. **Thread view changes when ANY NUT is klesha** - Switches to battle view with klesha/samskara zones
3. **Thread owns ALL its NUTs** - Kama's queues are just views/partitions of the same NUTs
4. **"Tainted" vs "Klesha"**:
   - A NUT is explicitly "klesha" when user marks it
   - Thread NUTs become "tainted" by association (computed, not stored)
   - If thread contains klesha NUT → all NUTs in thread are "tainted" in that context

## Core Modules Design

### 1. NUT Module (Core)

The base NUT is intentionally minimal and extensible:

```typescript
interface NUT {
  id: string;                              // timestamp or uuid
  text: string;                            // the actual content
  kind: 'note' | 'urge' | 'task' | string; // extensible
  timestamp: Date;
  
  // Kind-specific data in extensions
  extensions?: {
    [key: string]: any;                    // e.g., urge: { intensity: 5 }
  }
}

// Global klesha tracking (explicit user marking)
const nutIdIsKlesha: Set<string> = new Set();

// Example NUTs:
const noteNut: NUT = {
  id: "1234567890",
  text: "I notice I'm comparing myself to others",
  kind: "note",
  timestamp: new Date()
};

const urgeNut: NUT = {
  id: "1234567891",
  text: "I want to check Instagram",
  kind: "urge",
  timestamp: new Date(),
  extensions: {
    urge: { intensity: 7 }
  }
};

const taskNut: NUT = {
  id: "1234567892",
  text: "Take 5 deep breaths",
  kind: "task",
  timestamp: new Date(),
  extensions: {
    task: { completed: false }
  }
};
```

### 2. Thread Module

Threads are lightweight groupings that own their NUTs:

```typescript
interface Thread {
  id: string;
  rootNutId: string;    // The key NUT (not necessarily first)
  nutIds: string[];     // Ordered list (rootNutId must be included) - SOURCE OF TRUTH
}

interface ThreadNut {
  nutId: string;
  threadId: string;
}

// Maps for efficient lookups
type ThreadStore = {
  threadIdToThread: Map<string, Thread>;
  nutIdToThreadId: Map<string, string>;
};

// Thread operations
class ThreadModule {
  threadIdToThread: Map<string, Thread> = new Map();
  nutIdToThreadId: Map<string, string> = new Map();
  
  createThread(rootNutId: string, nutIds: string[]): Thread {
    if (!nutIds.includes(rootNutId)) {
      throw new Error("Root NUT must be in the thread");
    }
    
    const thread: Thread = {
      id: `thread_${Date.now()}`,
      rootNutId,
      nutIds  // This is the source of truth
    };
    
    this.threadIdToThread.set(thread.id, thread);
    
    // Map each NUT to this thread
    nutIds.forEach(nutId => {
      this.nutIdToThreadId.set(nutId, thread.id);
    });
    
    return thread;
  }
  
  // Check if thread is "tainted" (contains klesha NUT)
  isThreadTainted(threadId: string): boolean {
    const thread = this.threadIdToThread.get(threadId);
    if (!thread) return false;
    
    // Thread is tainted if ANY of its NUTs are klesha
    return thread.nutIds.some(id => nutIdIsKlesha.has(id));
  }
  
  // Check if NUT is "tainted" (in a tainted thread)
  isNutTainted(nutId: string): boolean {
    const threadId = this.nutIdToThreadId.get(nutId);
    if (!threadId) return false;
    
    return this.isThreadTainted(threadId);
  }
}
```

### 3. Kama Module (Battle System)

Kama manages the two-queue partition of thread NUTs:

```typescript
interface Kama {
  id: string;
  threadId: string;              // 1:1 with thread
  kleshaNutIds: string[];        // Subset of thread.nutIds (problem queue)
  samskaraNutIds: string[];      // Subset of thread.nutIds (solution queue)
  rootDesire?: DesireType;       // Identified Kama type
  state: KamaState;
}

type DesireType = 'vishaya' | 'kirti' | 'bhoga' | 'aishvarya' | 'iccha';

type KamaState = 'unidentified' | 'identified' | 'building' | 'sealed' | 'extracted';

class KamaModule {
  kamas: Map<string, Kama> = new Map();
  threadIdToKamaId: Map<string, string> = new Map();
  
  // Get or create Kama when thread becomes tainted
  ensureKamaForThread(thread: Thread): Kama {
    let kamaId = this.threadIdToKamaId.get(thread.id);
    if (kamaId) {
      return this.kamas.get(kamaId)!;
    }
    
    // Create new Kama with all NUTs in klesha queue initially
    const kama: Kama = {
      id: `kama_${Date.now()}`,
      threadId: thread.id,
      kleshaNutIds: [...thread.nutIds],  // Start with all as problems
      samskaraNutIds: [],                // Empty solution queue
      state: 'unidentified'
    };
    
    this.kamas.set(kama.id, kama);
    this.threadIdToKamaId.set(thread.id, kama.id);
    
    // Verify invariant: queues equal thread NUTs
    this.verifyKamaInvariant(kama, thread);
    
    return kama;
  }
  
  // Move NUT from klesha to samskara queue
  moveToSamskara(kamaId: string, nutId: string): void {
    const kama = this.kamas.get(kamaId);
    if (!kama) throw new Error("Kama not found");
    if (!kama.rootDesire) throw new Error("Must identify root desire first");
    
    // Remove from klesha queue
    const index = kama.kleshaNutIds.indexOf(nutId);
    if (index > -1) {
      kama.kleshaNutIds.splice(index, 1);
      
      // Add to samskara queue if not already there
      if (!kama.samskaraNutIds.includes(nutId)) {
        kama.samskaraNutIds.push(nutId);
      }
    }
    
    // Verify invariant maintained
    const thread = this.getThreadForKama(kama);
    this.verifyKamaInvariant(kama, thread);
  }
  
  // Move NUT back to klesha queue
  moveToKlesha(kamaId: string, nutId: string): void {
    const kama = this.kamas.get(kamaId);
    if (!kama) throw new Error("Kama not found");
    
    // Remove from samskara queue
    const index = kama.samskaraNutIds.indexOf(nutId);
    if (index > -1) {
      kama.samskaraNutIds.splice(index, 1);
      
      // Add back to klesha queue if not already there
      if (!kama.kleshaNutIds.includes(nutId)) {
        kama.kleshaNutIds.push(nutId);
      }
    }
    
    // Verify invariant maintained
    const thread = this.getThreadForKama(kama);
    this.verifyKamaInvariant(kama, thread);
  }
  
  // Verify that Kama queues exactly equal thread NUTs
  private verifyKamaInvariant(kama: Kama, thread: Thread): void {
    const kamaSet = new Set([...kama.kleshaNutIds, ...kama.samskaraNutIds]);
    const threadSet = new Set(thread.nutIds);
    
    if (kamaSet.size !== threadSet.size) {
      throw new Error("Kama queues don't match thread NUTs");
    }
    
    for (const nutId of threadSet) {
      if (!kamaSet.has(nutId)) {
        throw new Error(`Thread NUT ${nutId} missing from Kama queues`);
      }
    }
  }
  
  private getThreadForKama(kama: Kama): Thread {
    // Would get from ThreadModule in practice
    const threadModule = getThreadModule();
    return threadModule.threadIdToThread.get(kama.threadId)!;
  }
}
```

## View Logic

### Determining Thread View

```typescript
// View logic that determines UI display
function getThreadView(thread: Thread, threadModule: ThreadModule): 'normal' | 'battle' {
  if (threadModule.isThreadTainted(thread.id)) {
    return 'battle';  // Show two-zone klesha/samskara view
  }
  return 'normal';    // Regular thread view
}

// UI Component usage
function ThreadComponent({ threadId }) {
  const thread = threadModule.getThread(threadId);
  const view = getThreadView(thread, threadModule);
  
  if (view === 'battle') {
    // Ensure Kama exists for battle view
    const kama = kamaModule.ensureKamaForThread(thread);
    return <BattleView thread={thread} kama={kama} />;
  }
  
  return <NormalThreadView thread={thread} />;
}
```

## Data Flow Examples

### 1. User Marks NUT as Klesha

```typescript
// User action: Mark a NUT as klesha (pain point)
function markNutAsKlesha(nutId: string) {
  // 1. Add to global klesha set
  nutIdIsKlesha.add(nutId);
  
  // 2. Find the NUT's thread (if any)
  const threadId = threadModule.nutIdToThreadId.get(nutId);
  if (!threadId) return;  // Solo NUT, no thread
  
  // 3. Thread is now tainted, ensure Kama exists
  const thread = threadModule.threadIdToThread.get(threadId);
  const kama = kamaModule.ensureKamaForThread(thread);
  
  // 4. UI will now show battle view
  updateUI();
}
```

### 2. Building Samskara Chain

```typescript
// User drags NUT from klesha to samskara lane
function handleDragToSamskara(nutId: string, kamaId: string) {
  // Move between queues (thread.nutIds unchanged)
  kamaModule.moveToSamskara(kamaId, nutId);
  
  // Check if chain is complete
  const kama = kamaModule.kamas.get(kamaId);
  if (hasCompleteSamskaraChain(kama)) {
    enableSealCreation();
  }
}

function hasCompleteSamskaraChain(kama: Kama): boolean {
  const nuts = kama.samskaraNutIds.map(id => getNut(id));
  
  const hasNote = nuts.some(n => n.kind === 'note');
  const hasUrge = nuts.some(n => n.kind === 'urge');
  const hasTask = nuts.some(n => n.kind === 'task');
  
  return hasNote && hasUrge && hasTask;
}
```

## Key Invariants

1. **Thread owns NUTs**: `thread.nutIds` is source of truth
2. **Kama partitions Thread NUTs**: `Set(kama.kleshaNutIds ∪ kama.samskaraNutIds) === Set(thread.nutIds)`
3. **One Kama per Thread**: `threadIdToKamaId` is 1:1 mapping
4. **Tainted is computed**: Never stored, always derived from `nutIdIsKlesha`
5. **Klesha is explicit**: Only NUTs in `nutIdIsKlesha` are truly klesha

## Storage Strategy

```typescript
// Persistence layer
class PersistenceManager {
  save() {
    // Core data
    localStorage.setItem('nuts', JSON.stringify(Array.from(nutStore.entries())));
    localStorage.setItem('kleshaSet', JSON.stringify(Array.from(nutIdIsKlesha)));
    
    // Thread data
    localStorage.setItem('threads', JSON.stringify({
      threads: Array.from(threadModule.threadIdToThread.entries()),
      nutThreadMap: Array.from(threadModule.nutIdToThreadId.entries())
    }));
    
    // Kama data
    localStorage.setItem('kamas', JSON.stringify({
      kamas: Array.from(kamaModule.kamas.entries()),
      threadKamaMap: Array.from(kamaModule.threadIdToKamaId.entries())
    }));
  }
  
  load() {
    // Restore in order: NUTs → Threads → Kamas
    this.loadNuts();
    this.loadKleshaSet();
    this.loadThreads();
    this.loadKamas();
  }
}
```

## Benefits of This Architecture

1. **Single Source of Truth**: Thread owns NUTs, Kama just partitions
2. **Clean Separation**: Klesha marking vs tainted computation
3. **Flexible**: Can mark any NUT as klesha independently
4. **Consistent**: Thread and Kama queues always in sync
5. **UI Reactive**: View automatically switches based on taint

## Testing

```typescript
// Test: Mark NUT as klesha triggers battle view
const nut1 = createNut("I'm doom scrolling", "urge");
const thread = threadModule.createThread(nut1.id, [nut1.id]);

// Initially normal view
assert(getThreadView(thread) === 'normal');

// Mark as klesha
markNutAsKlesha(nut1.id);

// Now battle view
assert(getThreadView(thread) === 'battle');

// Kama created automatically
const kama = kamaModule.getKamaForThread(thread.id);
assert(kama !== null);
assert(kama.kleshaNutIds.includes(nut1.id));

// Verify invariant
assert(new Set(kama.kleshaNutIds).size === thread.nutIds.length);
```

This architecture provides clean separation between explicit klesha marking and computed taint state, while maintaining strict equality between Thread NUTs and Kama queues!