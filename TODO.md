# BookingPage Database Integration Tasks

## Current Status
- [x] Analyze current BookingPage.tsx structure
- [x] Review GraphQL queries and mutations
- [x] Understand database schema from Prisma
- [x] Plan integration approach

## Integration Tasks
- [ ] Replace hard-coded courts with Apollo GraphQL query
- [ ] Update data mapping for Court interface from database fields
- [ ] Implement availability checking using reservations data
- [ ] Replace booking logic with GraphQL mutations
- [ ] Remove fallback mechanisms (REST, localStorage)
- [ ] Test GraphQL integration
- [ ] Handle error states and loading states properly

## Files to Edit
- [ ] src/pages/BookingPage.tsx - Main integration file

## Testing
- [ ] Verify courts load from database
- [ ] Test availability checking
- [ ] Test booking creation
- [ ] Check error handling
