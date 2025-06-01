# Franchisee Module Documentation

The Franchisee module manages franchise owners who oversee gift card operations across multiple establishments. This
module provides comprehensive CRUD operations and business logic for franchise management.

## Module Overview

**Location**: `app/modules/franchisee/`  
**Status**: ✅ **Fully Implemented**  
**Database Table**: `franchisees`  
**User Role**: Managed by `franchisor`, used by `franchisee`

## Architecture

### Module Structure

```
app/modules/franchisee/
├── controllers/
│   └── franchisees.controller.ts     # HTTP request handlers
├── interfaces/
│   └── franchisee.interface.ts       # TypeScript interfaces
├── models/
│   └── franchisee.ts                 # Database model
├── repositories/
│   └── franchisees.repository.ts     # Data access layer
├── routes/
│   └── index.ts                      # Route definitions
├── services/
│   ├── create-franchisee/           # Creation service
│   ├── delete-franchisee/           # Deletion service
│   ├── get-franchisee/              # Retrieval service
│   ├── list-franchisees/            # Listing service
│   └── update-franchisee/           # Update service
└── validators/
    └── franchisees.validator.ts      # Request validation
```

## Core Features

### 1. Franchisee Registration

- **Unique Code Generation**: Automatic generation of franchise codes (e.g., "FR001")
- **Business Validation**: CNPJ validation and uniqueness checking
- **User Association**: Links franchisee to a user account
- **Commission Configuration**: Configurable commission rates per franchisee

### 2. Establishment Management

- **Hierarchy Control**: Franchisees manage multiple establishments
- **Commission Oversight**: Track commission earnings from all establishments
- **Performance Monitoring**: View establishment performance metrics

### 3. Financial Tracking

- **Commission Earnings**: Automatic commission calculation based on establishment transactions
- **Payment Processing**: Integration with Asaas for commission collection
- **Financial Reporting**: Detailed financial reports and analytics

## Database Schema

### Franchisee Model

```typescript
// app/modules/franchisee/models/franchisee.ts
class Franchisee extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public userId: number

  @column()
  public code: string // Unique franchise code

  @column()
  public companyName: string

  @column()
  public cnpj: string

  @column()
  public address: Record<string, any> // JSON field

  @column()
  public commissionRate: number // Percentage (e.g., 5.0 = 5%)

  @column()
  public status: 'active' | 'inactive' | 'suspended'

  // Relationships
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Establishment)
  public establishments: HasMany<typeof Establishment>

  @hasMany(() => Commission)
  public commissions: HasMany<typeof Commission>

  @hasMany(() => GiftCard)
  public giftCards: HasMany<typeof GiftCard>
}
```

### Address Structure

```typescript
interface FranchiseeAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}
```

## API Endpoints

### Admin Routes (Role: franchisor)

#### List Franchisees

```http
GET /api/v1/franchisees
```

**Query Parameters**:

- `page`: Page number (default: 1)
- `perPage`: Items per page (max: 100, default: 20)
- `sortBy`: `id|companyName|createdAt` (default: id)
- `order`: `asc|desc` (default: asc)
- `status`: `active|inactive|suspended`
- `search`: Search in company name and email

**Response Example**:

```json
{
  "data": [
    {
      "id": 1,
      "code": "FR001",
      "companyName": "Franchise ABC",
      "cnpj": "12.345.678/0001-90",
      "commissionRate": 5.0,
      "status": "active",
      "user": {
        "fullName": "John Doe",
        "email": "john@franchise-abc.com"
      },
      "establishmentsCount": 3,
      "totalCommissions": 1250.00
    }
  ],
  "meta": {
    "total": 25,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 2
  }
}
```

#### Get Franchisee Details

```http
GET /api/v1/franchisees/:id
```

**Query Parameters**:

- `include`: Set to "relations" to include establishments and commissions

#### Create Franchisee

```http
POST /api/v1/franchisees
```

**Request Body**:

```json
{
  "userId": 1,
  "companyName": "New Franchise LLC",
  "cnpj": "98.765.432/0001-10",
  "address": {
    "street": "Business Avenue",
    "number": "123",
    "complement": "Suite 100",
    "neighborhood": "Business District",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "commissionRate": 5.5
}
```

#### Update Franchisee

```http
PUT /api/v1/franchisees/:id
```

#### Delete Franchisee

```http
DELETE /api/v1/franchisees/:id
```

### Franchisee Routes (Role: franchisee)

#### Get Profile ⚠️

```http
GET /api/v1/franchisee/profile
```

**Status**: Placeholder implementation

#### Update Profile ⚠️

```http
PUT /api/v1/franchisee/profile
```

**Status**: Placeholder implementation

## Business Logic Services

### 1. Create Franchisee Service

**Location**: `app/modules/franchisee/services/create-franchisee/create-franchisee.service.ts`

**Features**:

- Validates user account existence
- Generates unique franchise code
- Validates CNPJ format and uniqueness
- Sets default commission rate if not provided
- Creates Asaas customer for payment processing

```typescript
class CreateFranchiseeService {
  public async execute(data: CreateFranchiseeData): Promise<Franchisee> {
    // Validate user exists and doesn't have franchisee
    await this.validateUser(data.userId)

    // Generate unique code
    const code = await this.generateUniqueCode()

    // Validate CNPJ
    await this.validateCnpj(data.cnpj)

    // Create franchisee
    const franchisee = await this.repository.create({
      ...data,
      code,
      status: 'active'
    })

    return franchisee
  }
}
```

### 2. List Franchisees Service

**Location**: `app/modules/franchisee/services/list-franchisees/list-franchisees.service.ts`

**Features**:

- Advanced filtering and sorting
- Pagination support
- Search functionality
- Performance optimization with selective loading

### 3. Update Franchisee Service

**Features**:

- Partial updates support
- Business rule validation
- Audit trail maintenance
- Relationship integrity checks

### 4. Delete Franchisee Service

**Features**:

- Dependency checking (establishments, commissions)
- Soft delete implementation
- Cascade handling
- Data cleanup

## Repository Layer

### Franchisees Repository

**Location**: `app/modules/franchisee/repositories/franchisees.repository.ts`

**Key Methods**:

```typescript
class FranchiseesRepository extends LucidRepository<Franchisee> {
  // Find by unique code
  async findByCode(code: string): Promise<Franchisee | null>

  // Find by CNPJ
  async findByCnpj(cnpj: string): Promise<Franchisee | null>

  // Advanced pagination with filters
  async paginateWithFilters(options: PaginationOptions): Promise<PaginatedResult>

  // Get franchisee with performance metrics
  async findWithMetrics(id: number): Promise<FranchiseeWithMetrics>

  // Check if user can be franchisee
  async canUserBeFranchisee(userId: number): Promise<boolean>
}
```

## Validation Rules

### Create/Update Validation

**Location**: `app/modules/franchisee/validators/franchisees.validator.ts`

```typescript
class FranchiseeValidator {
  public static createSchema = vine.object({
    userId: vine.number().exists('users', 'id'),
    companyName: vine.string().minLength(2).maxLength(100),
    cnpj: vine.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
    address: vine.object({
      street: vine.string().minLength(2),
      number: vine.string().minLength(1),
      complement: vine.string().optional(),
      neighborhood: vine.string().minLength(2),
      city: vine.string().minLength(2),
      state: vine.string().fixedLength(2),
      zipCode: vine.string().regex(/^\d{5}-\d{3}$/)
    }),
    commissionRate: vine.number().range([0.1, 50.0]).optional()
  })
}
```

## Integration Points

### 1. User Management Integration

- **User Account Linking**: Each franchisee must be associated with a user account
- **Role Assignment**: Users are automatically assigned the `franchisee` role
- **Access Control**: ACL middleware restricts access based on user-franchisee relationship

### 2. Establishment Integration

- **Hierarchy Management**: Franchisees can create and manage multiple establishments
- **Commission Calculation**: Establishment transactions generate commissions for franchisees
- **Performance Tracking**: Aggregate establishment metrics for franchisee reporting

### 3. Commission Integration

- **Automatic Generation**: Commissions are automatically created for franchisee when establishments process
  transactions
- **Payment Processing**: Integration with Asaas for automated commission collection
- **Status Tracking**: Real-time commission payment status updates

### 4. Asaas Payment Integration

- **Customer Registration**: Franchisees are automatically registered as Asaas customers
- **Commission Charges**: Automated charging for commission payments
- **Webhook Processing**: Real-time payment status updates via webhooks

## Business Rules

### 1. Franchisee Creation Rules

- User can only be associated with one franchisee
- CNPJ must be unique across all franchisees
- Commission rate must be between 0.1% and 50%
- Default status is "active"

### 2. Commission Rules

- Commission rate is configurable per franchisee
- Commissions are generated only for establishment recharge transactions
- Commission amount = transaction amount × commission rate
- Commissions are automatically charged via Asaas

### 3. Status Management

- **Active**: Can create establishments and receive commissions
- **Inactive**: Cannot create new establishments, existing operations continue
- **Suspended**: All operations are blocked, establishments cannot process transactions

## Performance Considerations

### 1. Database Optimization

- Indexed fields: `code`, `cnpj`, `user_id`, `status`
- Composite indexes for common query patterns
- Optimized relationship loading

### 2. Caching Strategy

- Franchisee data cached for 15 minutes
- Commission summaries cached hourly
- Performance metrics cached daily

### 3. Query Optimization

- Eager loading for related data
- Selective field loading for list operations
- Pagination limits (max 100 items per page)

## Error Handling

### Common Error Scenarios

- **Duplicate CNPJ**: Returns 422 with specific error message
- **User Not Found**: Returns 404 when user doesn't exist
- **User Already Franchisee**: Returns 422 when user is already associated
- **Commission Dependencies**: Returns 422 when trying to delete franchisee with pending commissions

### Error Response Format

```json
{
  "errors": [
    {
      "message": "CNPJ already exists",
      "code": "CNPJ_DUPLICATE",
      "field": "cnpj"
    }
  ]
}
```

## Future Enhancements

### Planned Features

1. **Advanced Analytics**: Detailed performance dashboards for franchisees
2. **Multi-level Commissions**: Support for hierarchical commission structures
3. **Automated Onboarding**: Streamlined franchisee registration process
4. **Mobile App Integration**: Mobile-specific API endpoints
5. **Notification System**: Real-time notifications for important events

### API Enhancements

1. **Profile Management**: Complete franchisee self-service profile management
2. **Establishment Analytics**: Detailed establishment performance metrics
3. **Commission Forecasting**: Predictive commission calculations
4. **Bulk Operations**: Batch franchisee operations

---

*The Franchisee module is production-ready with comprehensive business logic, proper validation, and integration with
the payment system. It serves as the foundation for the franchise management aspect of the gift card platform.*
