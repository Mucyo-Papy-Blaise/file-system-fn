# Collections Feature - Quick Start Testing Guide

## Prerequisites
- Backend running: `npm run start:dev` in file-system-bn
- Frontend running: `npm run dev` in file-system-fn
- Authenticated user (login required)

## Testing Flow

### 1. View Collections List
1. Login to application
2. Navigate to **Collections** in sidebar (between Documents and Members)
3. Should see:
   - "New Collection" button (top right)
   - List of collections created by user (MEMBER) or all collections (ADMIN)
   - Each collection card shows: name, description, document count, creator, date
   - Three-dot menu with Edit/Delete (for creator/ADMIN)

### 2. Create a Collection
1. Click **"New Collection"** button
2. Fill in:
   - **Name** (required): "Q1 Reports"
   - **Description** (optional): "Quarterly financial reports"
3. Click **"Create Collection"**
4. Success toast appears: "Collection created successfully"
5. Modal closes
6. New collection appears in list

### 3. Edit a Collection
1. Click three-dot menu on any collection card
2. Click **"Edit"**
3. Modal opens with pre-filled data
4. Update name/description
5. Click **"Update Collection"**
6. Success toast appears
7. Collection card updates immediately

### 4. View Collection Details
1. Click on a collection card
2. Collection detail page loads showing:
   - Collection name and description
   - Back button to collections list
   - Documents grid (or empty state)
   - "Add Document" button (creator/ADMIN only)
   - Creator info and creation date

### 5. Add Document to Collection
1. On collection detail page, click **"Add Document"** button
2. Modal opens with searchable document list
3. Search for document by title or summary
4. Click to select a document
5. Click **"Add Document"**
6. Success toast: "Document added to collection"
7. Document appears in collection grid
8. Document count badge increases

### 6. Remove Document from Collection
1. On collection detail page with documents
2. Click **"Remove from Collection"** button under a document
3. Delete confirmation modal appears
4. Type document title to confirm
5. Click **"Delete"**
6. Success toast: "Document removed from collection"
7. Document disappears from collection
8. Document count decreases

### 7. Delete a Collection
1. From collections list, click three-dot menu
2. Click **"Delete"**
3. Delete confirmation modal appears
4. Type collection name to confirm
5. Click **"Delete"**
6. Success toast: "Collection deleted successfully"
7. Collection disappears from list

## Role-Based Testing

### As MEMBER User
- ✅ Can create collections
- ✅ Can see only own collections
- ✅ Can edit own collections
- ✅ Can add/remove documents from own collections
- ✅ Cannot access other users' collections (404 or redirected)
- ✅ Cannot modify other users' collections

### As ADMIN User
- ✅ Can see all organization collections
- ✅ Can create collections
- ✅ Can edit any collection
- ✅ Can delete any collection
- ✅ Can add/remove documents from any collection

## Expected Error Cases

### Cannot Create Collection
- Name field is empty → Error message shown
- Name has less than 2 characters (backend validation)

### Cannot Add Document
- Document already in collection → Error message from backend
- Document doesn't exist → Error message from backend
- No documents available → "No documents available" message

### Cannot Access Collection
- MEMBER trying to access other user's collection → 404 or redirect
- Invalid collection ID → 404 error
- Collection deleted → 404 error

## Performance Expectations

- Loading collections: < 1 second
- Adding document: < 2 seconds
- Removing document: < 1 second
- Deleting collection: < 1 second
- Editing collection: < 1 second

## UI/UX Checks

- [ ] Loading skeletons appear while fetching
- [ ] Empty states show helpful messages
- [ ] Buttons disable during loading
- [ ] Toast notifications appear for all actions
- [ ] Modal closes on success
- [ ] Three-dot menus work correctly
- [ ] Back button works correctly
- [ ] Responsive design on mobile/tablet
- [ ] No duplicate documents can be added
- [ ] Collection appears immediately after creation

## Network Monitoring

In browser DevTools Network tab, verify:
- POST /api/collections → 201 Created
- GET /api/collections → 200 OK
- GET /api/collections/:id → 200 OK
- PATCH /api/collections/:id → 200 OK
- DELETE /api/collections/:id → 200 OK
- POST /api/collections/:id/documents → 201 Created
- DELETE /api/collections/:id/documents/:documentId → 200 OK

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Collections list empty | Verify you're logged in; create a new collection |
| "Collection not found" | Verify collection ID in URL; try refreshing |
| Cannot add document | Verify document exists; try another document |
| "Document already in collection" | Remove and re-add if needed |
| Slow loading | Check network in DevTools; verify backend is running |
| Toast not appearing | Check browser console for errors |
