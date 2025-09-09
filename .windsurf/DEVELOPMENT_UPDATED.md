#### Development Plan

**Phase 0: Environment & Boilerplate (Day 1, 1 hour)**
- **TS Updates**: Copy files; run `npm run type-check`—fix any errors (e.g., add missing types). — Status: Pending (not verified in this session)
- **Sub-Tasks**: Setup; verify `tsc --noEmit` passes. — Status: Pending (not verified)
- **Testing Checklist**: No TS errors; app runs. — Status: Pending (not verified)
- **Pitfalls**: Missing @types—install if needed (e.g., for recharts: `npm i -D @types/recharts` if issues).

**Phase 1: API Integration & Data Enrichment (Day 1-2, 3 hours)**
- **TS Updates**: Ensure `ICoin` covers all fields; type Promise.all returns. — Status: Complete
- **Sub-Tasks**: Implement typed useCoins; type Map<string, ITicker>. — Status: Complete
- **Testing Checklist**: Type-check passes; prices typed as number. — Status: Pending (not verified)
- **Pitfalls**: API response mismatches—use `unknown` for errors, cast if needed.

**Phase 2: Routing & Details Page (Day 2-3, 4 hours)**
- **TS Updates**: Type useParams<{ id: string }>; ITicker for coin state. — Status: Complete
- **Sub-Tasks**: Type historical mapping to IHistoricalChart[]. — Status: Complete
- **Testing Checklist**: No prop-type errors in console; chart data typed. — Status: Pending (not verified in runtime)
- **Pitfalls**: Optional chaining—use ? for undefined.

**Phase 3: Real-Time Polling & Search Enhancements (Day 3-4, 4 hours)**
- **TS Updates**: Type setCoins callback; string for sort keys. — Status: Pending (setCoins typed; no explicit sort keys present)
- **Sub-Tasks**: Type debounce timeout. — Status: Pending (SearchBar debouncedSearch exists, but cleanup isn't wired to useEffect return)
- **Testing Checklist**: Polling updates without TS warnings. — Status: Pending (not verified)
- **Pitfalls**: useCallback deps—add exhaustive-deps ESLint rule.

**Phase 4: Favorites & State Management (Day 4-5, 3 hours)**
- **TS Updates**: string[] for favorites; type toggle as (id: string) => void. — Status: Complete
- **Sub-Tasks**: Type localStorage JSON.parse as string[]. — Status: Complete
- **Testing Checklist**: Toggle doesn't break types. — Status: Pending (not verified in runtime)
- **Pitfalls**: Array methods—use filter/map with generics.

**Phase 5: UI Polish, Responsiveness & Accessibility (Day 5-6, 4 hours)**
- **TS Updates**: FC<Props> for all components; aria-label as string. — Status: Pending (most components typed; may not be "all")
- **Sub-Tasks**: Type className unions if custom. — Status: Pending (some are typed as string; not audited "all")
- **Testing Checklist**: Lighthouse + TS no errors. — Status: Pending (not run)
- **Pitfalls**: Event handlers—type e: React.ChangeEvent.

**Phase 6: Error Handling & Performance (Day 6-7, 2 hours)**
- **TS Updates**: Error: unknown in catch; type ErrorInfo. — Status: Complete
- **Sub-Tasks**: Memo with typed props. — Status: Complete
- **Testing Checklist**: Boundary catches typed errors. — Status: Complete
- **Pitfalls**: Strict null checks—use ! for DOM.getElementById.

**Phase 7: Testing, Deploy & Portfolio (Day 7-8, 3 hours)**
- **TS Updates**: Vitest with typed tests (e.g., expect.typeOf). — Status: Pending (no tests configured)
- **Sub-Tasks**: Add `npm run build` includes tsc; test types in Vitest. — Status: Pending (build includes tsc; tests not present)
- **Testing Checklist**: `vitest --run` passes; deploy builds without TS errors. — Status: Pending
- **Pitfalls**: Build fails on types—run type-check first.

**Extensions**: Add generics for hooks (e.g., useCoins<T extends ICoin>); migrate to Zod for API validation.
