#### Development Plan

**Phase 0: Environment & Boilerplate (Day 1, 1 hour)**
- **TS Updates**: Copy files; run `npm run type-check`—fix any errors (e.g., add missing types).
- **Sub-Tasks**: Setup; verify `tsc --noEmit` passes.
- **Testing Checklist**: No TS errors; app runs.
- **Pitfalls**: Missing @types—install if needed (e.g., for recharts: `npm i -D @types/recharts` if issues).

**Phase 1: API Integration & Data Enrichment (Day 1-2, 3 hours)**
- **TS Updates**: Ensure `ICoin` covers all fields; type Promise.all returns.
- **Sub-Tasks**: Implement typed useCoins; type Map<string, ITicker>.
- **Testing Checklist**: Type-check passes; prices typed as number.
- **Pitfalls**: API response mismatches—use `unknown` for errors, cast if needed.

**Phase 2: Routing & Details Page (Day 2-3, 4 hours)**
- **TS Updates**: Type useParams<{ id: string }>; ITicker for coin state.
- **Sub-Tasks**: Type historical mapping to IHistoricalChart[].
- **Testing Checklist**: No prop-type errors in console; chart data typed.
- **Pitfalls**: Optional chaining—use ? for undefined.

**Phase 3: Real-Time Polling & Search Enhancements (Day 3-4, 4 hours)**
- **TS Updates**: Type setCoins callback; string for sort keys.
- **Sub-Tasks**: Type debounce timeout.
- **Testing Checklist**: Polling updates without TS warnings.
- **Pitfalls**: useCallback deps—add exhaustive-deps ESLint rule.

**Phase 4: Favorites & State Management (Day 4-5, 3 hours)**
- **TS Updates**: string[] for favorites; type toggle as (id: string) => void.
- **Sub-Tasks**: Type localStorage JSON.parse as string[].
- **Testing Checklist**: Toggle doesn't break types.
- **Pitfalls**: Array methods—use filter/map with generics.

**Phase 5: UI Polish, Responsiveness & Accessibility (Day 5-6, 4 hours)**
- **TS Updates**: FC<Props> for all components; aria-label as string.
- **Sub-Tasks**: Type className unions if custom.
- **Testing Checklist**: Lighthouse + TS no errors.
- **Pitfalls**: Event handlers—type e: React.ChangeEvent.

**Phase 6: Error Handling & Performance (Day 6-7, 2 hours)**
- **TS Updates**: Error: unknown in catch; type ErrorInfo.
- **Sub-Tasks**: Memo with typed props.
- **Testing Checklist**: Boundary catches typed errors.
- **Pitfalls**: Strict null checks—use ! for DOM.getElementById.

**Phase 7: Testing, Deploy & Portfolio (Day 7-8, 3 hours)**
- **TS Updates**: Vitest with typed tests (e.g., expect.typeOf).
- **Sub-Tasks**: Add `npm run build` includes tsc; test types in Vitest.
- **Testing Checklist**: `vitest --run` passes; deploy builds without TS errors.
- **Pitfalls**: Build fails on types—run type-check first.

**Extensions**: Add generics for hooks (e.g., useCoins<T extends ICoin>); migrate to Zod for API validation.