# Collections Feature - Quick Reference Guide

## Quick Start for Developers

### Frontend Files to Know

```
src/
├── api/
│   ├── collection.api.ts          ← API methods & normalization
│   └── index.ts                   ← Exports (updated)
├── lib/
│   └── hooks/
│       └── useCollections.ts      ← React Query hooks
├── types/
│   └── collection.ts              ← Type definitions
├── components/
│   ├── collections/
│   │   ├── CollectionCard.tsx
│   │   ├── CreateCollectionModal.tsx
│   │   ├── EditCollectionModal.tsx
│   │   └── AddDocumentModal.tsx
│   └── layout/
│       └── Sidebar.tsx            ← Collections link added
└── app/
    └── dashboard/
        ├── collections/
        │   ├── page.tsx           ← List page
        │   └── [id]/
        │       └── page.tsx       ← Detail page
        └── layout.tsx             ← Page titles added
```

### Backend Files to Know

```
src/collections/
├── collections.controller.ts      ← 7 endpoints
├── collections.service.ts         ← Business logic
├── collections.module.ts          ← Module setup
└── dto/
    ├── create-collection.dto.ts
    ├── update-collection.dto.ts
    ├── add-document.dto.ts
    └── index.ts

prisma/schema.prisma               ← Collection & CollectionDocument models
```

## API Endpoint Reference

### Create Collection
```typescript
POST /api/collections
Body: { name: string; description?: string }
Returns: Collection
```

### List Collections
```typescript
GET /api/collections
Returns: Collection[]  // MEMBER: own only, ADMIN: all
```

### Get Collection
```typescript
GET /api/collections/:id
Returns: Collection  // With full documents array
```

### Update Collection
```typescript
PATCH /api/collections/:id
Body: { name?: string; description?: string }
Returns: Collection
```

### Delete Collection
```typescript
DELETE /api/collections/:id
Returns: Collection
```

### Add Document
```typescript
POST /api/collections/:id/documents
Body: { documentId: string }
Returns: Collection  // With updated documents
```

### Remove Document
```typescript
DELETE /api/collections/:id/documents/:documentId
Returns: Collection  // Without removed document
```

## Common Tasks

### Fetch Collections List
```typescript
import { useGetCollections } from '@/lib/hooks/useCollections';

export function MyComponent() {
  const { collections, isLoading, isError } = useGetCollections();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  
  return (
    <ul>
      {collections.map(col => (
        <li key={col.id}>{col.name}</li>
      ))}
    </ul>
  );
}
```

### Fetch Single Collection
```typescript
import { useGetCollectionById } from '@/lib/hooks/useCollections';

export function CollectionDetail({ id }: { id: string }) {
  const { collection, isLoading } = useGetCollectionById(id);
  
  return collection && (
    <div>
      <h1>{collection.name}</h1>
      <p>{collection.documentCount} documents</p>
    </div>
  );
}
```

### Create Collection
```typescript
import { useCreateCollection } from '@/lib/hooks/useCollections';

export function CreateButton() {
  const { mutate: createCollection, isLoading } = useCreateCollection();
  
  const handleCreate = () => {
    createCollection(
      { name: 'My Collection', description: 'Test' },
      {
        onSuccess: () => console.log('Created!'),
        onError: (error) => console.error(error),
      }
    );
  };
  
  return <button onClick={handleCreate}>{isLoading ? 'Creating...' : 'Create'}</button>;
}
```

### Add Document
```typescript
import { useAddDocument } from '@/lib/hooks/useCollections';

export function AddDocButton({ collectionId }: { collectionId: string }) {
  const { mutate: addDocument, isLoading } = useAddDocument();
  
  const handleAdd = (documentId: string) => {
    addDocument({ collectionId, documentId }, {
      onSuccess: () => console.log('Added!'),
    });
  };
  
  return <button onClick={() => handleAdd('doc_123')}>Add</button>;
}
```

## Permission Checks

### Check if User Can Modify
```typescript
import { Role } from '@/types/enum';
import type { AuthUser } from '@/types/auth';
import type { Collection } from '@/types/collection';

function canModify(user: AuthUser, collection: Collection): boolean {
  return user.id === collection.createdBy.id || user.role === Role.ADMIN;
}
```

### Frontend UI Logic
```typescript
{canModify && (
  <button onClick={() => onEdit(collection)}>Edit</button>
)}
```

## Error Handling

### API Errors
```typescript
try {
  await collectionApi.createCollection({ name: 'Test' });
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400: console.log('Validation error:', error.message);
      case 403: console.log('Permission denied:', error.message);
      case 409: console.log('Conflict (duplicate):', error.message);
      case 404: console.log('Not found:', error.message);
    }
  }
}
```

### In Components
```typescript
const { mutate, isError, error } = useCreateCollection();

{isError && <div>{(error as ApiError).message}</div>}
```

## Response Structure

### List Response
```typescript
Collection {
  id: string
  name: string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
  createdBy: { id, name }
  documentCount: number
  documents: Document[]
}
```

### Document in Collection
```typescript
Document {
  id: string
  title: string
  fileName: string
  summary: string
  category: { id, name }
  folder: { id, name }
  uploadedBy: { id, name }
  // ... other fields
}
```

## Testing

### Create & List
```bash
1. Click "New Collection" in sidebar
2. Fill name: "Test Collection"
3. Click "Create"
4. See collection in list
```

### Add Document
```bash
1. Click on collection
2. Click "Add Document"
3. Search and select document
4. Click "Add"
5. See document in collection
```

### Edit & Delete
```bash
1. Click three-dot menu on collection
2. Click "Edit" or "Delete"
3. Make changes or confirm deletion
4. See updates immediately
```

## Debugging

### Check API Calls
```
Open DevTools → Network tab
Filter by: "collections"
Check request/response headers and body
```

### Check React Query
```
Install: React Query DevTools
Import: import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
Add: <ReactQueryDevtools initialIsOpen={false} />
```

### Check Component State
```
Add console.log() in components
Use React DevTools Profiler
Check useCollections hook return values
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Collection not saving | Check network tab for errors; verify JWT token in request |
| Cannot add document | Verify document exists; check if already in collection |
| Permission error | Ensure user is creator or ADMIN |
| Empty list for MEMBER | Check createdBy matches current user |
| Page not rendering | Check console for TypeScript errors; verify layout.tsx page titles |

## Key Takeaways

1. **API Layer** - All network calls go through `collection.api.ts`
2. **State Management** - All data fetching via React Query hooks
3. **Permission Checks** - Both backend (enforced) and frontend (UI)
4. **Error Handling** - Use try/catch and mutation error handlers
5. **Caching** - React Query automatically refetches on mutation success
6. **Types** - Everything is TypeScript typed for safety

## Resources

- See `COLLECTIONS_INTEGRATION.md` for full integration details
- See `TECHNICAL_ARCHITECTURE.md` for system design
- See `COLLECTIONS_API_EXAMPLES.md` for all request/response formats
- See `COLLECTIONS_TESTING_GUIDE.md` for testing procedures
