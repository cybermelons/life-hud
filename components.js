// Shared Components for Lilaya PWA
// This file injects common UI components into every page

document.addEventListener('DOMContentLoaded', () => {
    // Detect current page from URL
    const currentPath = window.location.pathname;
    const currentPage = currentPath === '/' ? 'kingdoms' : 
                       currentPath.includes('inventory') ? 'inventory' :
                       currentPath.includes('library') ? 'library' : 
                       'kingdoms';
    
    // Get theme classes based on page
    const getThemeClasses = () => {
        if (currentPath.includes('mind')) {
            return {
                button: 'bg-blue-600',
                buttonHover: 'hover:bg-blue-500',
                border: 'border-blue-600',
                focus: 'focus:border-blue-600',
                text: 'text-blue-400'
            };
        }
        if (currentPath.includes('body')) {
            return {
                button: 'bg-green-600',
                buttonHover: 'hover:bg-green-500',
                border: 'border-green-600',
                focus: 'focus:border-green-600',
                text: 'text-green-400'
            };
        }
        if (currentPath.includes('spirit') || currentPath.includes('library')) {
            return {
                button: 'bg-purple-600',
                buttonHover: 'hover:bg-purple-500',
                border: 'border-purple-600',
                focus: 'focus:border-purple-600',
                text: 'text-purple-400'
            };
        }
        // Default theme
        return {
            button: 'bg-blue-600',
            buttonHover: 'hover:bg-blue-500',
            border: 'border-blue-600',
            focus: 'focus:border-blue-600',
            text: 'text-blue-400'
        };
    };
    
    const theme = getThemeClasses();
    
    // Bottom Navigation Component
    const bottomNav = `
        <nav class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 safe-bottom">
            <div class="grid grid-cols-3 h-16">
                <a href="/" class="flex flex-col items-center justify-center ${currentPage === 'kingdoms' ? 'text-white' : 'text-gray-400'}">
                    <span class="text-xl">🏰</span>
                    <span class="text-xs">Kingdoms</span>
                </a>
                <a href="/inventory" class="flex flex-col items-center justify-center ${currentPage === 'inventory' ? 'text-white' : 'text-gray-400'}">
                    <span class="text-xl">📦</span>
                    <span class="text-xs">Inventory</span>
                </a>
                <a href="/library" class="flex flex-col items-center justify-center ${currentPage === 'library' ? `text-${themeColor}-400` : 'text-gray-400'}">
                    <span class="text-xl">📚</span>
                    <span class="text-xs">Library</span>
                </a>
            </div>
        </nav>
    `;
    
    // NUT Capture Button Component
    const nutCaptureButton = `
        <button 
            @click="$store.app.captureOpen = !$store.app.captureOpen"
            class="fixed bottom-20 right-4 w-14 h-14 bg-${themeColor}-600 rounded-full shadow-lg flex items-center justify-center text-2xl safe-bottom"
            :class="{ 'rotate-45': $store.app.captureOpen }"
            style="transition: transform 0.2s"
        >
            +
        </button>
    `;
    
    // NUT Capture Panel Component
    const nutCapturePanel = `
        <div 
            x-show="$store.app.captureOpen"
            x-transition:enter="transition ease-out duration-200"
            x-transition:enter-start="translate-y-full"
            x-transition:enter-end="translate-y-0"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="translate-y-0"
            x-transition:leave-end="translate-y-full"
            class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-${themeColor}-600 p-4 safe-bottom"
            style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
        >
            <form @submit.prevent="$store.app.addNut()">
                <!-- Type Selector -->
                <div class="flex gap-2 mb-3">
                    <button 
                        type="button"
                        @click="$store.app.nutType = 'note'"
                        :class="$store.app.nutType === 'note' ? 'bg-${themeColor}-600' : 'bg-gray-700'"
                        class="flex-1 py-2 px-3 rounded-lg"
                    >
                        📝 Note
                    </button>
                    <button 
                        type="button"
                        @click="$store.app.nutType = 'urge'"
                        :class="$store.app.nutType === 'urge' ? 'bg-${themeColor}-600' : 'bg-gray-700'"
                        class="flex-1 py-2 px-3 rounded-lg"
                    >
                        💭 Urge
                    </button>
                    <button 
                        type="button"
                        @click="$store.app.nutType = 'task'"
                        :class="$store.app.nutType === 'task' ? 'bg-${themeColor}-600' : 'bg-gray-700'"
                        class="flex-1 py-2 px-3 rounded-lg"
                    >
                        ✅ Task
                    </button>
                </div>
                
                <!-- Input Field -->
                <div class="flex gap-2">
                    <input 
                        type="text"
                        x-model="$store.app.nutContent"
                        placeholder="What's on your mind?"
                        class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-${themeColor}-600"
                        x-ref="nutInput"
                        @keydown.escape="$store.app.captureOpen = false"
                    >
                    <button 
                        type="submit"
                        class="bg-${themeColor}-600 px-6 py-3 rounded-lg font-semibold"
                        :disabled="!$store.app.nutContent.trim()"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Find where to inject components
    const body = document.body;
    
    // Check if components already exist (to avoid duplication)
    if (!document.querySelector('nav.fixed.bottom-0')) {
        // Create a temporary container to parse HTML
        const temp = document.createElement('div');
        
        // Add bottom navigation
        temp.innerHTML = bottomNav;
        body.appendChild(temp.firstElementChild);
        
        // Add NUT capture button
        temp.innerHTML = nutCaptureButton;
        body.appendChild(temp.firstElementChild);
        
        // Add NUT capture panel
        temp.innerHTML = nutCapturePanel;
        body.appendChild(temp.firstElementChild);
    }
    
    // Add safe-bottom class to body if not present
    if (!body.classList.contains('safe-bottom')) {
        const style = document.createElement('style');
        style.textContent = `
            .safe-bottom {
                padding-bottom: env(safe-area-inset-bottom);
            }
        `;
        document.head.appendChild(style);
    }
});