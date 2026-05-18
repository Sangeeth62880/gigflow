# GigFlow API Documentation

Base URL: `http://localhost:5050/api`

## Authentication

### Register a new user
- **Method**: `POST`
- **Path**: `/auth/register`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "sales" // optional, defaults to "sales". Can be "admin"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": { ... },
      "token": "eyJhb..."
    }
  }
  ```

### Login
- **Method**: `POST`
- **Path**: `/auth/login`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { ... },
      "token": "eyJhb..."
    }
  }
  ```

### Get Current User
- **Method**: `GET`
- **Path**: `/auth/me`
- **Auth Required**: Yes (Bearer Token)
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "User profile fetched",
    "data": { ... }
  }
  ```

---

## Leads

*All lead endpoints require authentication via Bearer token.*

### Create Lead
- **Method**: `POST`
- **Path**: `/leads`
- **Auth Required**: Yes
- **Role Required**: Admin or Sales
- **Body**:
  ```json
  {
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "status": "New", // optional, enum: New, Contacted, Qualified, Lost
    "source": "Organic" // required, enum: Organic, Referral, LinkedIn, Twitter, Direct, Other, Website, Instagram
  }
  ```
- **Response** (201): Lead object

### Get Leads (Paginated & Filtered)
- **Method**: `GET`
- **Path**: `/leads`
- **Auth Required**: Yes
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10, max: 50)
  - `search`: string (matches name or email)
  - `status`: string (enum)
  - `source`: string (enum)
  - `sort`: "latest" | "oldest" (default: "latest")
- **Notes**: Admins see all leads. Sales users see only leads they created.
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "leads": [ ... ],
      "pagination": {
        "total": 42,
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
      }
    }
  }
  ```

### Get Lead by ID
- **Method**: `GET`
- **Path**: `/leads/:id`
- **Auth Required**: Yes
- **Notes**: Sales users can only access their own leads.
- **Response** (200): Lead object

### Update Lead
- **Method**: `PUT`
- **Path**: `/leads/:id`
- **Auth Required**: Yes
- **Notes**: Sales users can only update their own leads.
- **Body**: Any field from Create Lead (all optional)
- **Response** (200): Updated lead object

### Delete Lead
- **Method**: `DELETE`
- **Path**: `/leads/:id`
- **Auth Required**: Yes
- **Notes**: Sales users can only delete their own leads.
- **Response** (200): `{ "success": true, "message": "Lead deleted successfully" }`

### Export Leads
- **Method**: `GET`
- **Path**: `/leads/export`
- **Auth Required**: Yes
- **Query Params**: Same as GET `/leads` (except `page` and `limit` are ignored)
- **Response** (200): Array of all matching lead objects (unpaginated).
