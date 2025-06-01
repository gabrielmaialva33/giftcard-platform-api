# Architecture Overview

This document provides a comprehensive overview of the gift card platform architecture, including system design,
technology stack, and architectural patterns.

## System Architecture

The gift card platform follows a modular, layered architecture built on AdonisJS v6 framework, designed for scalability,
maintainability, and performance.

### High-Level Architecture Diagram

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Applications"
        WEB[Web Dashboard<br/>React/Next.js]
        PWA[PWA Mobile App<br/>React/PWA]
        API_CLIENT[API Clients<br/>Third-party integrations]
    end

    %% API Gateway/Load Balancer
    subgraph "API Layer"
        LB[Load Balancer<br/>nginx/AWS ALB]
        GATEWAY[API Gateway<br/>Rate Limiting & Auth]
    end

    %% Application Layer
    subgraph "Application Services"
        subgraph "AdonisJS Application"
            AUTH[Authentication<br/>JWT & ACL]
            MODULES[Business Modules<br/>Franchisee, Establishment<br/>Gift Card, Commission]
            MIDDLEWARE[Middleware Layer<br/>Auth, ACL, CORS, etc.]
            CONTROLLERS[Controllers<br/>HTTP Request Handlers]
            SERVICES[Business Services<br/>Domain Logic]
            REPOSITORIES[Repositories<br/>Data Access Layer]
        end
        
        QUEUE[Queue System<br/>Bull Queue + Redis]
        JOBS[Background Jobs<br/>Commission Processing<br/>Webhook Handling]
    end

    %% External Services
    subgraph "External Services"
        ASAAS[Asaas Payment API<br/>Commission Processing]
        PRINT[Printing Service<br/>Physical Cards]
        EMAIL[Email Service<br/>Notifications]
    end

    %% Data Layer
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL<br/>Primary Database)]
        REDIS[(Redis<br/>Cache & Queue)]
        S3[(AWS S3<br/>File Storage)]
    end

    %% Connections
    WEB --> LB
    PWA --> LB
    API_CLIENT --> LB
    
    LB --> GATEWAY
    GATEWAY --> AUTH
    
    AUTH --> MODULES
    MODULES --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> REPOSITORIES
    
    REPOSITORIES --> POSTGRES
    QUEUE --> REDIS
    JOBS --> QUEUE
    
    SERVICES --> ASAAS
    SERVICES --> PRINT
    SERVICES --> EMAIL
    
    SERVICES --> S3
    QUEUE --> S3
```

## Technology Stack

### Backend Framework

- **AdonisJS v6**: Modern Node.js framework with TypeScript support
- **Node.js**: Runtime environment for server-side JavaScript
- **TypeScript**: Type-safe development with enhanced developer experience

### Database & Storage

- **PostgreSQL**: Primary relational database for transactional data
- **Redis**: Caching and queue management
- **AWS S3**: File storage for QR codes and documents

### Authentication & Security

- **JWT Tokens**: Stateless authentication with AdonisJS access tokens
- **ACL Middleware**: Role-based access control
- **Password Hashing**: Secure password storage with bcrypt

### Background Processing

- **Bull Queue**: Redis-based job queue for background processing
- **Job Processors**: Commission calculation, webhook processing

### External Integrations

- **Asaas API**: Payment processing and commission charging
- **QR Code Generation**: Gift card identification and scanning

### Development & Deployment

- **Docker**: Containerized deployment
- **pnpm**: Package management
- **ESLint & Prettier**: Code quality and formatting
- **Japa**: Testing framework

## Architectural Patterns

### 1. **Modular Architecture**

The application follows a module-based architecture where each business domain is encapsulated in its own module:

```mermaid
graph LR
    subgraph "Module Structure"
        CONTROLLERS[Controllers<br/>HTTP Layer]
        SERVICES[Services<br/>Business Logic]
        MODELS[Models<br/>Data Layer]
        REPOSITORIES[Repositories<br/>Data Access]
        VALIDATORS[Validators<br/>Input Validation]
        ROUTES[Routes<br/>Endpoint Definition]
        INTERFACES[Interfaces<br/>Type Definitions]
    end

    CONTROLLERS --> SERVICES
    SERVICES --> REPOSITORIES
    REPOSITORIES --> MODELS
    CONTROLLERS --> VALIDATORS
    ROUTES --> CONTROLLERS
    SERVICES --> INTERFACES
```

### 2. **Layered Architecture Pattern**

```mermaid
graph TD
    PRESENTATION[Presentation Layer<br/>Controllers, Routes, Middleware]
    BUSINESS[Business Layer<br/>Services, Domain Logic]
    DATA[Data Access Layer<br/>Repositories, Models]
    EXTERNAL[External Services Layer<br/>Asaas API, Email, etc.]

    PRESENTATION --> BUSINESS
    BUSINESS --> DATA
    BUSINESS --> EXTERNAL
```

### 3. **Repository Pattern**

All data access is abstracted through repositories that implement a common interface:

```typescript
interface LucidRepositoryInterface<T> {
  find(id: number): Promise<T | null>

  create(data: Partial<T>): Promise<T>

  update(id: number, data: Partial<T>): Promise<T>

  delete(id: number): Promise<boolean>

  paginate(options: PaginationOptions): Promise<PaginatedResult<T>>
}
```

## Core Business Modules

### 1. **Authentication Module** (`app/modules/auth/`)

- User login/logout functionality
- JWT token management
- Password reset capabilities
- Role-based access control

### 2. **User Management Module** (`app/modules/user/`)

- User CRUD operations
- Role assignment and management
- Profile management
- User authentication services

### 3. **Franchisee Module** (`app/modules/franchisee/`)

- Franchisee registration and management
- Commission rate configuration
- Establishment oversight
- Performance analytics

### 4. **Establishment Module** (`app/modules/establishment/`)

- Local business registration
- Gift card management interface
- Transaction processing
- Payment method configuration

### 5. **Gift Card Module** (`app/modules/gift-card/`)

- Gift card creation with QR codes
- Balance management
- Recharge operations
- Usage tracking

### 6. **Transaction Module** (`app/modules/transaction/`)

- Transaction recording and audit
- Balance calculations
- Transaction history
- Reporting capabilities

### 7. **Commission Module** (`app/modules/commission/`)

- Automatic commission calculation
- Payment processing integration
- Status tracking
- Financial reporting

### 8. **Webhook Module** (`app/modules/webhook/`)

- External payment event processing
- Asaas webhook handling
- Event queue management
- Status synchronization

### 9. **Asaas Integration Module** (`app/modules/asaas/`)

- Payment API client
- Customer management
- Charge creation and tracking
- Webhook signature validation

## Security Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth
    participant DB

    Client->>API: Login Request (email/password)
    API->>Auth: Validate Credentials
    Auth->>DB: Query User
    DB-->>Auth: User Data
    Auth->>Auth: Generate JWT Token
    Auth-->>API: Token + User Info
    API-->>Client: Authentication Response

    Note over Client: Store token for subsequent requests

    Client->>API: Protected Request (with token)
    API->>Auth: Validate Token
    Auth->>DB: Check Token Validity
    DB-->>Auth: Token Status
    Auth-->>API: User Context
    API->>API: Process Request
    API-->>Client: Response
```

### Authorization Levels

1. **Public Routes**: No authentication required
2. **Authenticated Routes**: Valid JWT token required
3. **Role-Based Routes**: Specific role permissions required
4. **Resource-Based Routes**: Ownership/relationship validation

### Data Protection

- **Password Hashing**: bcrypt with salt
- **Token Security**: JWT with expiration and refresh capabilities
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Lucid ORM parameterized queries
- **CORS Configuration**: Controlled cross-origin access

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: JWT tokens enable stateless authentication
- **Database Connection Pooling**: Efficient database resource usage
- **Queue Processing**: Background jobs can be distributed across workers
- **Microservice Ready**: Modular design supports service extraction

### Performance Optimizations

- **Database Indexing**: Strategic indexes on frequently queried columns
- **Redis Caching**: Fast access to frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Lazy Loading**: Optimized database queries with eager loading where needed

### Monitoring & Observability

- **Structured Logging**: Comprehensive application logging
- **Error Tracking**: Centralized error monitoring
- **Performance Metrics**: Request timing and database query performance
- **Health Checks**: Application and dependency health monitoring

## Deployment Architecture

### Production Environment

```mermaid
graph TB
    subgraph "Load Balancer"
        ALB[AWS Application Load Balancer]
    end

    subgraph "Application Tier"
        APP1[AdonisJS Instance 1]
        APP2[AdonisJS Instance 2]
        APP3[AdonisJS Instance N]
    end

    subgraph "Database Tier"
        RDS[(AWS RDS PostgreSQL<br/>Multi-AZ)]
        ELASTICACHE[(AWS ElastiCache Redis<br/>Cluster Mode)]
    end

    subgraph "Storage"
        S3[(AWS S3<br/>File Storage)]
    end

    subgraph "External Services"
        ASAAS_API[Asaas Payment API]
    end

    ALB --> APP1
    ALB --> APP2
    ALB --> APP3

    APP1 --> RDS
    APP2 --> RDS
    APP3 --> RDS

    APP1 --> ELASTICACHE
    APP2 --> ELASTICACHE
    APP3 --> ELASTICACHE

    APP1 --> S3
    APP2 --> S3
    APP3 --> S3

    APP1 --> ASAAS_API
    APP2 --> ASAAS_API
    APP3 --> ASAAS_API
```

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "Development"
        CODE[Code Changes]
        GIT[Git Repository]
    end

    subgraph "CI/CD Pipeline"
        BUILD[Build & Test]
        LINT[Code Quality]
        DOCKER[Docker Build]
        DEPLOY[Deploy to Staging]
        TEST[E2E Tests]
        PROD[Deploy to Production]
    end

    CODE --> GIT
    GIT --> BUILD
    BUILD --> LINT
    LINT --> DOCKER
    DOCKER --> DEPLOY
    DEPLOY --> TEST
    TEST --> PROD
```

## Quality Assurance

### Code Quality

- **TypeScript**: Static type checking
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Testing Strategy

- **Unit Tests**: Service and repository layer testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user flow testing
- **Performance Tests**: Load and stress testing

### Development Workflow

- **Feature Branches**: Isolated development
- **Code Reviews**: Peer review process
- **Automated Testing**: CI/CD integration
- **Documentation**: Comprehensive technical documentation

---

*This architecture supports the current gift card platform requirements and provides a foundation for future scaling and
feature development.*
