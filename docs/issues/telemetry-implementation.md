# Issue: Add Behavioral Telemetry for Rapid UX Iteration

## Priority: Phase 3 (Week 3)

## Overview
Add minimal telemetry to understand core user behavior and optimize the Kama extraction loop. Focus on behavioral metrics (clicks, time spent, completion rates) rather than database analytics.

## Implementation Timeline

### Phase 3: Core Success Metrics (5 metrics only)
Start tracking when we have first working game loop.

**The 5 Essential Metrics:**
1. **Activation Rate**: % users who complete first extraction within 24 hours
2. **Core Loop Completion**: Klesha mark → Chain build → Task done rate
3. **Fatal Abandon Points**: Which screen users quit on
4. **Day 2 Retention**: % who return next day
5. **Time to Value**: Minutes to first successful extraction

**Simple implementation:**
```javascript
// Just track these 5 things
track('first_extraction_completed', { time_to_complete_minutes: X })
track('user_returned_day_2', { returned: true/false })
track('abandoned_at_screen', { screen: 'chain_builder' })
track('core_loop_stage', { stage: 'klesha|chain|task|done' })
track('session_ended', { completed_extraction: true/false })
```

### Phase 4: Full Behavioral Tracking
Once core loop is validated, add comprehensive tracking.

**Button Usage:**
- Click frequency per button
- Unused buttons (never clicked)
- Most common 3-button sequences

**Screen Flow:**
- Time spent per screen
- Navigation paths
- Back button usage
- Quick exits (<2 seconds)

**NUT Capture Behavior:**
- Time between NUTs
- Burst patterns (3+ in <1 minute) 
- Typing duration
- Peak activity times

**Chain Building:**
- Drag vs click usage
- Rearrangements before satisfaction
- Abandon rate per step
- Time on chain screen

**Task Completion:**
- Time from creation → completion
- Same-day completion rate
- Most completed task types
- Never-completed tasks

## Key Insights Needed

### For Rapid Iteration
1. **Funnel:** Where's the biggest drop-off?
   - Captures → Kleshas → Chains → Tasks → Completions
   
2. **Time Investment:** Is it too long?
   - Average session length
   - Time to first success
   
3. **Feature Discovery:** Do users find core features?
   - % who find chain building
   - % who identify kama type
   
4. **Friction Points:** What needs fixing?
   - Most abandoned screen
   - Longest time stuck on screen

## Success Criteria
- **Activation**: 50%+ complete first extraction within 7 days
- **Retention**: 30%+ return after 3 days  
- **Success**: 20%+ of kleshas become completed tasks
- **Habit**: Users return every 2-3 days average

## Implementation Notes

### What NOT to Track (Privacy)
- Actual NUT content
- Personal identifiers
- Location data
- Cross-device tracking

### Storage
- Local batch storage first
- Send batches of 10-20 events
- Anonymous user IDs only
- Option to opt-out

### Tools to Consider
- PostHog (easy, free tier)
- Plausible (privacy-focused)
- Custom endpoint (most control)
- Local-only for MVP testing

## Acceptance Criteria
- [ ] 5 core metrics tracking in Phase 3
- [ ] No impact on app performance
- [ ] User can opt-out
- [ ] Dashboard to view metrics (can be simple)
- [ ] Full behavioral tracking ready for Phase 4

## Dependencies
- Core game loop must be complete
- At least 10 test users available
- Basic backend endpoint for data collection

## Notes
- Don't add telemetry before Phase 3 - core mechanics still changing
- Start with just 5 metrics, expand only after validation
- Focus on behavioral patterns, not database queries
- Use insights to drive next feature decisions