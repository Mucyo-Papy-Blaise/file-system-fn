# Collections API - Request/Response Examples

## Backend Endpoints & Responses

### 1. Create Collection
**Request:**
```http
POST /api/collections
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Q1 Financial Reports",
  "description": "Collection of quarterly financial reports"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clli1234567890abcdef",
    "name": "Q1 Financial Reports",
    "description": "Collection of quarterly financial reports",
    "organizationId": "org_123",
    "createdAt": "2026-05-18T10:00:00Z",
    "updatedAt": "2026-05-18T10:00:00Z",
    "createdBy": {
      "id": "user_456",
      "email": "john@company.com",
      "name": "John Doe"
    },
    "documents": []
  },
  "timestamp": "2026-05-18T10:00:00Z"
}
```

### 2. Get All Collections
**Request:**
```http
GET /api/collections
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clli1234567890abcdef",
      "name": "Q1 Financial Reports",
      "description": "Collection of quarterly financial reports",
      "organizationId": "org_123",
      "createdAt": "2026-05-18T10:00:00Z",
      "updatedAt": "2026-05-18T10:00:00Z",
      "createdBy": {
        "id": "user_456",
        "email": "john@company.com",
        "name": "John Doe"
      },
      "_count": {
        "documents": 3
      }
    }
  ],
  "timestamp": "2026-05-18T10:00:00Z"
}
```

### 3. Get Collection by ID (with documents)
**Request:**
```http
GET /api/collections/clli1234567890abcdef
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clli1234567890abcdef",
    "name": "Q1 Financial Reports",
    "description": "Collection of quarterly financial reports",
    "organizationId": "org_123",
    "createdAt": "2026-05-18T10:00:00Z",
    "updatedAt": "2026-05-18T10:00:00Z",
    "createdBy": {
      "id": "user_456",
      "email": "john@company.com",
      "name": "John Doe"
    },
    "documents": [
      {
        "document": {
          "id": "doc_789",
          "fileName": "Q1_2026_Report.pdf",
          "fileUrl": "https://cdn.example.com/Q1_2026_Report.pdf",
          "extractedText": "Financial data for Q1 2026...",
          "title": "Q1 2026 Financial Report",
          "summary": "Quarterly financial performance report",
          "documentOwner": "Finance Department",
          "author": "Jane Smith",
          "documentType": "Financial Report",
          "concerning": "Financial Performance",
          "purpose": "Quarterly Review",
          "documentDate": "2026-03-31",
          "createdAt": "2026-05-15T14:30:00Z",
          "updatedAt": "2026-05-15T14:30:00Z",
          "category": {
            "id": "cat_111",
            "name": "Financial Reports"
          },
          "folder": {
            "id": "fld_222",
            "name": "Reports"
          },
          "uploadedBy": {
            "id": "user_789",
            "email": "jane@company.com",
            "name": "Jane Smith"
          },
          "organizationId": "org_123"
        }
      }
    ]
  },
  "timestamp": "2026-05-18T10:00:00Z"
}
```

### 4. Update Collection
**Request:**
```http
PATCH /api/collections/clli1234567890abcdef
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Q1 2026 Financial Reports",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Same structure as GET by ID response
  }
}
```

### 5. Delete Collection
**Request:**
```http
DELETE /api/collections/clli1234567890abcdef
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clli1234567890abcdef",
    "name": "Q1 Financial Reports",
    "description": "Collection of quarterly financial reports",
    "organizationId": "org_123",
    "createdAt": "2026-05-18T10:00:00Z",
    "updatedAt": "2026-05-18T10:00:00Z",
    "createdBy": {
      "id": "user_456",
      "email": "john@company.com",
      "name": "John Doe"
    }
  }
}
```

### 6. Add Document to Collection
**Request:**
```http
POST /api/collections/clli1234567890abcdef/documents
Authorization: Bearer {token}
Content-Type: application/json

{
  "documentId": "doc_789"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    // Returns updated collection with all documents
    // Same structure as GET by ID response
  }
}
```

### 7. Remove Document from Collection
**Request:**
```http
DELETE /api/collections/clli1234567890abcdef/documents/doc_789
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Returns updated collection without the removed document
    // Same structure as GET by ID response
  }
}
```

## Error Responses

### Collection Not Found
```json
{
  "statusCode": 404,
  "message": "Collection not found.",
  "error": "Not Found"
}
```

### Permission Denied (MEMBER accessing others' collection)
```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this collection.",
  "error": "Forbidden"
}
```

### Document Already in Collection
```json
{
  "statusCode": 409,
  "message": "Document is already in this collection.",
  "error": "Conflict"
}
```

### Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be a string"
  ],
  "error": "Bad Request"
}
```
