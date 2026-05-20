# Collections Feature - Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Pages                                   │   │
│  │  • /collections - List view                         │   │
│  │  • /collections/[id] - Detail view                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Components                              │   │
│  │  • CollectionCard                                   │   │
│  │  • CreateCollectionModal                            │   │
│  │  • EditCollectionModal                              │   │
│  │  • AddDocumentModal                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Query Hooks                          │   │
│  │  • useGetCollections()                              │   │
│  │  • useGetCollectionById()                           │   │
│  │  • useCreateCollection()                            │   │
│  │  • useUpdateCollection()                            │   │
│  │  • useDeleteCollection()                            │   │
│  │  • useAddDocument()                                 │   │
│  │  • useRemoveDocument()                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           API Layer (collection.api.ts)             │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Type Definitions                             │   │   │
│  │  │ • CollectionApiRecord                       │   │   │
│  │  │ • CollectionDocumentApiRecord               │   │   │
│  │  │ • DocumentInCollectionApiRecord             │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Normalization Functions                      │   │   │
│  │  │ • normalizeCollection()                     │   │   │
│  │  │   - Transforms nested documents             │   │   │
│  │  │   - Normalizes user objects                │   │   │
│  │  │   - Handles _count vs documentCount         │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ API Methods                                 │   │   │
│  │  │ • createCollection()                        │   │   │
│  │  │ • getCollections()                          │   │   │
│  │  │ • getCollectionById()                       │   │   │
│  │  │ • updateCollection()                        │   │   │
│  │  │ • deleteCollection()                        │   │   │
│  │  │ • addDocument()                             │   │   │
│  │  │ • removeDocument()                          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Axios HTTP Client                          │   │
│  │  • Interceptors for JWT token                       │   │
│  │  • Automatic JSON serialization                     │   │
│  │  • Error handling                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP
                        /api/collections
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Collections Controller                      │   │
│  │  • POST /collections                               │   │
│  │  • GET /collections                                │   │
│  │  • GET /collections/:id                            │   │
│  │  • PATCH /collections/:id                          │   │
│  │  • DELETE /collections/:id                         │   │
│  │  • POST /collections/:id/documents                 │   │
│  │  • DELETE /collections/:id/documents/:documentId   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Collections Service (Business Logic)           │   │
│  │  • create()                                         │   │
│  │  • findAll() - Role-based filtering                │   │
│  │  • findOne()                                        │   │
│  │  • update() - Authorization check                  │   │
│  │  • remove() - Authorization check                  │   │
│  │  • addDocument() - Duplicate check                 │   │
│  │  • removeDocument()                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Prisma ORM                                │   │
│  │  • Collection model                                │   │
│  │  • CollectionDocument model                        │   │
│  │  • User, Organization, Document relations          │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       PostgreSQL Database                            │   │
│  │  • collections table                               │   │
│  │  • collection_documents table                       │   │
│  │  • users table (foreign key)                        │   │
│  │  • organizations table (foreign key)                │   │
│  │  • documents table (foreign key)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow - Create Collection Example

```
User Interface
    ↓
User fills CreateCollectionModal with name + description
    ↓
Clicks "Create Collection" button
    ↓
useCreateCollection() mutation triggered
    ↓
collectionApi.createCollection({ name, description })
    ↓
apiClient.post("/collections", { name, description })
    ↓
HTTP POST request with JWT token
    ↓
┌─────────────────────────────────────────────────────┐
│              Backend Processing                      │
│  1. JwtAuthGuard validates token                    │
│  2. CurrentUser decorator extracts user from token  │
│  3. CollectionsController.create() receives request │
│  4. CollectionsService.create() executes:           │
│     - Validates input (min 2 chars name)           │
│     - Trims whitespace                              │
│     - Creates collection in Prisma                  │
│     - Includes createdBy relation                   │
│     - Returns new collection                        │
│  5. ApiSuccessEnvelope wraps response               │
└─────────────────────────────────────────────────────┘
    ↓
HTTP 201 Response with Collection object
    ↓
apiClient receives and extracts response.data
    ↓
normalizeCollection() transforms:
  - Converts createdBy object
  - Handles empty documents array
  - Prepares for React Query cache
    ↓
React Query caches under queryKey: ['collections']
    ↓
collectionApi.mutate() resolves
    ↓
Modal onSuccess callback triggers
    ↓
useCreateCollection mutation success handler:
  - Shows success toast
  - Closes modal
  - Invalidates ['collections'] queryKey
    ↓
Collections list query is refetched
    ↓
New collection appears in list
    ↓
UI re-renders with new data
    ↓
User sees new collection immediately
```

## Data Flow - Add Document Example

```
User clicks "Add Document" button
    ↓
AddDocumentModal opens with useGetDocuments() hook
    ↓
Documents list loads and filters out already-added docs
    ↓
User selects document and clicks "Add Document"
    ↓
useAddDocument() mutation with { collectionId, documentId }
    ↓
collectionApi.addDocument(collectionId, documentId)
    ↓
HTTP POST /collections/:id/documents with { documentId }
    ↓
┌─────────────────────────────────────────────────────┐
│         Backend Document Addition Logic             │
│  1. Verify collection exists and user has access   │
│  2. Verify document exists in organization         │
│  3. Check document not already in collection       │
│  4. Create CollectionDocument record               │
│  5. Return full collection with updated documents  │
│                                                     │
│  If duplicate → HTTP 409 Conflict error             │
│  If not found → HTTP 404 Not Found error            │
│  If forbidden → HTTP 403 Forbidden error            │
└─────────────────────────────────────────────────────┘
    ↓
HTTP 201 Response with updated Collection
    ↓
Frontend normalizes nested documents structure
    ↓
React Query caches new collection
    ↓
Success callback triggers:
  - Shows "Document added successfully" toast
  - Closes modal
  - Invalidates ['collections'] queryKey
    ↓
Collection detail page refetches
    ↓
DocumentCard components re-render
    ↓
User sees document added to collection
```

## Error Handling Flow

```
User action triggers API call
    ↓
apiClient sends request with error interceptor
    ↓
Backend error response
    ↓
Error interceptor catches response
    ↓
Extract error message from response
    ↓
Throw ApiError with status + message
    ↓
Mutation error handler catches
    ↓
Show error toast with message
    ↓
Form/Modal remains open for retry
    ↓
User sees clear error message
```

## Cache Invalidation Strategy

### Query Keys
```typescript
['collections']           // All collections list
['collections', id]       // Specific collection
```

### Invalidation Triggers
```
createCollection     → invalidate ['collections']
updateCollection     → invalidate ['collections']
deleteCollection     → invalidate ['collections']
addDocument          → invalidate ['collections']
removeDocument       → invalidate ['collections']
```

Result: Automatic refetch of all affected queries

## Type Safety

### Backend Response Type
```typescript
interface ApiSuccessEnvelope<TData> {
  success: boolean;
  data: TData;
  timestamp?: string;
}
```

### Frontend Transformation
```typescript
Backend Response
    ↓
ApiSuccessEnvelope<CollectionApiRecord>
    ↓
Extract .data
    ↓
CollectionApiRecord
    ↓
normalizeCollection()
    ↓
Collection (frontend type)
```

All steps are typed to catch errors at compile-time.

## Permission Levels

### MEMBER Role
- Can create own collections
- Can only see own collections
- Can only modify own collections
- Can add/remove documents from own collections

### ADMIN Role
- Can create collections
- Can see all organization collections
- Can modify any collection
- Can add/remove documents from any collection

Permissions enforced at both backend (service logic) and frontend (UI visibility).
