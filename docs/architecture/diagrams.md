# System Architecture Diagrams

This document contains comprehensive Mermaid diagrams illustrating the gift card platform's architecture, data flows,
and business processes.

## Business Flow Diagrams

### Gift Card Lifecycle Flow

```mermaid
flowchart TD
    START([Start]) --> CREATE[Create Gift Card]
    CREATE --> |Generated| QRCODE[QR Code Created]
    QRCODE --> ACTIVE{Card Status: Active}
    ACTIVE --> |Ready for use| RECHARGE[Recharge Operation]
    ACTIVE --> |Ready for use| USE[Use Operation]
    
    RECHARGE --> |Add funds| BALANCE_UP[Balance Increased]
    BALANCE_UP --> |Commission triggered| COMMISSION[Generate Commission]
    COMMISSION --> |Payment processing| ASAAS[Asaas API]
    ASAAS --> |Webhook| PAYMENT_STATUS[Update Payment Status]
    
    USE --> |Deduct funds| BALANCE_DOWN[Balance Decreased]
    BALANCE_DOWN --> |Check balance| ZERO{Balance = 0?}
    ZERO --> |Yes| USED[Status: Used]
    ZERO --> |No| ACTIVE
    
    ACTIVE --> |Expiration date| EXPIRED[Status: Expired]
    ACTIVE --> |Manual action| CANCELLED[Status: Cancelled]
    
    USED --> END([End])
    EXPIRED --> END
    CANCELLED --> END
    
    style CREATE fill:#e1f5fe
    style COMMISSION fill:#fff3e0
    style ASAAS fill:#f3e5f5
    style PAYMENT_STATUS fill:#e8f5e8
```

### Commission Processing Flow

```mermaid
sequenceDiagram
    participant E as Establishment
    participant API as Gift Card API
    participant Q as Job Queue
    participant A as Asaas API
    participant W as Webhook
    participant DB as Database

    E->>API: Recharge Gift Card
    API->>DB: Record Transaction
    API->>DB: Calculate Commission
    API->>Q: Queue Commission Job
    API-->>E: Transaction Success
    
    Q->>A: Create Commission Charge
    A-->>Q: Charge Created (ID)
    Q->>DB: Update Commission (charged)
    
    Note over A: Customer makes payment
    
    A->>W: Payment Webhook
    W->>API: Process Webhook
    API->>DB: Update Commission (paid)
    API-->>W: Webhook Processed
```

### User Authentication & Authorization Flow

```mermaid
graph TD
    USER[User Login] --> VALIDATE[Validate Credentials]
    VALIDATE --> |Success| JWT[Generate JWT Token]
    VALIDATE --> |Failure| ERROR[Authentication Error]
    
    JWT --> ROLE{Check User Role}
    
    ROLE --> |franchisor| ADMIN[System Admin Access]
    ROLE --> |franchisee| FRANCHISE[Franchise Management]
    ROLE --> |establishment| ESTABLISHMENT[Gift Card Operations]
    
    ADMIN --> |Full Access| ALL_RESOURCES[All System Resources]
    
    FRANCHISE --> MANAGE_EST[Manage Establishments]
    FRANCHISE --> VIEW_COMM[View Commissions]
    FRANCHISE --> GIFT_OVERSIGHT[Gift Card Oversight]
    
    ESTABLISHMENT --> GIFT_OPS[Gift Card Operations]
    ESTABLISHMENT --> RECHARGE[Recharge Cards]
    ESTABLISHMENT --> USE_CARDS[Use Cards]
    
    ALL_RESOURCES --> ACL{ACL Middleware}
    MANAGE_EST --> ACL
    VIEW_COMM --> ACL
    GIFT_OVERSIGHT --> ACL
    GIFT_OPS --> ACL
    RECHARGE --> ACL
    USE_CARDS --> ACL
    
    ACL --> |Authorized| RESOURCE[Access Resource]
    ACL --> |Denied| FORBIDDEN[403 Forbidden]
    
    style JWT fill:#e3f2fd
    style ACL fill:#fff3e0
    style FORBIDDEN fill:#ffebee
```

## Technical Architecture Diagrams

### Modular System Architecture

```mermaid
graph TB
    subgraph "External Clients"
        WEB[Web Dashboard]
        MOBILE[Mobile PWA]
        API_CLIENT[API Clients]
    end
    
    subgraph "API Gateway Layer"
        NGINX[Nginx Load Balancer]
        RATE_LIMIT[Rate Limiting]
        CORS[CORS Handler]
    end
    
    subgraph "Authentication Layer"
        AUTH_MIDDLEWARE[Auth Middleware]
        ACL_MIDDLEWARE[ACL Middleware]
        JWT_SERVICE[JWT Service]
    end
    
    subgraph "Application Layer"
        subgraph "Core Modules"
            AUTH_MODULE[Auth Module]
            USER_MODULE[User Module]
            FRANCHISEE_MODULE[Franchisee Module]
            ESTABLISHMENT_MODULE[Establishment Module]
            GIFT_CARD_MODULE[Gift Card Module]
            TRANSACTION_MODULE[Transaction Module]
            COMMISSION_MODULE[Commission Module]
            WEBHOOK_MODULE[Webhook Module]
        end
        
        subgraph "Shared Services"
            ASAAS_SERVICE[Asaas Integration]
            QUEUE_SERVICE[Queue Service]
            REPOSITORY_BASE[Base Repository]
        end
        
        subgraph "Background Jobs"
            COMMISSION_JOB[Commission Processing]
            WEBHOOK_JOB[Webhook Processing]
            BATCH_JOB[Batch Operations]
        end
    end
    
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL)]
        REDIS[(Redis)]
        S3[(File Storage)]
    end
    
    subgraph "External Services"
        ASAAS_API[Asaas Payment API]
        EMAIL_SERVICE[Email Service]
        SMS_SERVICE[SMS Service]
    end
    
    %% Client connections
    WEB --> NGINX
    MOBILE --> NGINX
    API_CLIENT --> NGINX
    
    %% Gateway flow
    NGINX --> RATE_LIMIT
    RATE_LIMIT --> CORS
    CORS --> AUTH_MIDDLEWARE
    
    %% Authentication flow
    AUTH_MIDDLEWARE --> ACL_MIDDLEWARE
    ACL_MIDDLEWARE --> AUTH_MODULE
    AUTH_MIDDLEWARE --> JWT_SERVICE
    
    %% Module interactions
    AUTH_MODULE --> USER_MODULE
    USER_MODULE --> FRANCHISEE_MODULE
    FRANCHISEE_MODULE --> ESTABLISHMENT_MODULE
    ESTABLISHMENT_MODULE --> GIFT_CARD_MODULE
    GIFT_CARD_MODULE --> TRANSACTION_MODULE
    TRANSACTION_MODULE --> COMMISSION_MODULE
    COMMISSION_MODULE --> WEBHOOK_MODULE
    
    %% Shared services
    COMMISSION_MODULE --> ASAAS_SERVICE
    WEBHOOK_MODULE --> QUEUE_SERVICE
    QUEUE_SERVICE --> COMMISSION_JOB
    QUEUE_SERVICE --> WEBHOOK_JOB
    QUEUE_SERVICE --> BATCH_JOB
    
    %% Repository pattern
    FRANCHISEE_MODULE --> REPOSITORY_BASE
    ESTABLISHMENT_MODULE --> REPOSITORY_BASE
    GIFT_CARD_MODULE --> REPOSITORY_BASE
    TRANSACTION_MODULE --> REPOSITORY_BASE
    COMMISSION_MODULE --> REPOSITORY_BASE
    
    %% Data connections
    REPOSITORY_BASE --> POSTGRES
    QUEUE_SERVICE --> REDIS
    GIFT_CARD_MODULE --> S3
    
    %% External service connections
    ASAAS_SERVICE --> ASAAS_API
    AUTH_MODULE --> EMAIL_SERVICE
    USER_MODULE --> SMS_SERVICE
    
    style AUTH_MIDDLEWARE fill:#e3f2fd
    style ACL_MIDDLEWARE fill:#fff3e0
    style ASAAS_SERVICE fill:#f3e5f5
    style QUEUE_SERVICE fill:#e8f5e8
```

### Database Relationship Flow

```mermaid
erDiagram
    USERS {
        int id PK
        varchar email UK
        enum role
        enum status
    }
    
    FRANCHISEES {
        int id PK
        int user_id FK
        varchar code UK
        varchar company_name
        decimal commission_rate
    }
    
    ESTABLISHMENTS {
        int id PK
        int user_id FK
        int franchisee_id FK
        varchar name
        varchar asaas_customer_id
    }
    
    GIFT_CARDS {
        int id PK
        varchar code UK
        int franchisee_id FK
        int establishment_id FK
        decimal current_balance
        enum status
    }
    
    TRANSACTIONS {
        int id PK
        int gift_card_id FK
        int establishment_id FK
        enum type
        decimal amount
        decimal balance_before
        decimal balance_after
    }
    
    COMMISSIONS {
        int id PK
        int franchisee_id FK
        int establishment_id FK
        int transaction_id FK
        decimal amount
        enum status
        varchar asaas_charge_id
    }
    
    PAYMENT_WEBHOOKS {
        int id PK
        enum provider
        varchar event_type
        varchar resource_id
        json payload
    }
    
    %% User hierarchy
    USERS ||--o| FRANCHISEES : "can be"
    USERS ||--o| ESTABLISHMENTS : "can be"
    FRANCHISEES ||--o{ ESTABLISHMENTS : "manages"
    
    %% Gift card flow
    FRANCHISEES ||--o{ GIFT_CARDS : "oversees"
    ESTABLISHMENTS ||--o{ GIFT_CARDS : "owns"
    GIFT_CARDS ||--o{ TRANSACTIONS : "has"
    ESTABLISHMENTS ||--o{ TRANSACTIONS : "processes"
    
    %% Commission flow
    TRANSACTIONS ||--|| COMMISSIONS : "generates"
    FRANCHISEES ||--o{ COMMISSIONS : "receives"
    ESTABLISHMENTS ||--o{ COMMISSIONS : "pays"
    
    %% Payment tracking
    COMMISSIONS ||--o{ PAYMENT_WEBHOOKS : "tracked by"
```

### Asaas Payment Integration Flow

```mermaid
sequenceDiagram
    participant S as System
    participant A as Asaas API
    participant C as Customer
    participant W as Webhook
    
    Note over S,A: Initial Setup
    S->>A: Create Customer (Establishment)
    A-->>S: Customer ID
    
    Note over S,A: Commission Charging
    S->>A: Create Charge
    A-->>S: Charge ID & Payment Data
    S->>C: Send Payment Instructions
    
    Note over C,A: Customer Payment
    C->>A: Make Payment (PIX/Boleto/Card)
    A-->>C: Payment Confirmation
    
    Note over A,W: Webhook Notification
    A->>W: Payment Webhook
    W->>S: Process Webhook
    S->>S: Update Commission Status
    S-->>W: Webhook Processed
    
    Note over S: Optional Actions
    S->>S: Send Notification
    S->>S: Generate Receipt
```

### Queue Processing Architecture

```mermaid
graph TD
    subgraph "Job Triggers"
        RECHARGE[Gift Card Recharge]
        WEBHOOK_EVENT[Webhook Received]
        BATCH_PROCESS[Batch Processing Request]
    end
    
    subgraph "Queue System (Redis)"
        COMMISSION_QUEUE[Commission Queue]
        WEBHOOK_QUEUE[Webhook Queue]
        BATCH_QUEUE[Batch Queue]
    end
    
    subgraph "Job Processors"
        COMMISSION_WORKER[Commission Worker]
        WEBHOOK_WORKER[Webhook Worker]
        BATCH_WORKER[Batch Worker]
    end
    
    subgraph "Job Actions"
        CALCULATE_COMM[Calculate Commission]
        CHARGE_ASAAS[Charge via Asaas]
        UPDATE_STATUS[Update Status]
        PROCESS_PAYMENT[Process Payment Event]
        BULK_OPERATIONS[Bulk Operations]
    end
    
    subgraph "External Services"
        ASAAS[Asaas API]
        EMAIL[Email Service]
        DB[(Database)]
    end
    
    %% Job queuing
    RECHARGE --> COMMISSION_QUEUE
    WEBHOOK_EVENT --> WEBHOOK_QUEUE
    BATCH_PROCESS --> BATCH_QUEUE
    
    %% Job processing
    COMMISSION_QUEUE --> COMMISSION_WORKER
    WEBHOOK_QUEUE --> WEBHOOK_WORKER
    BATCH_QUEUE --> BATCH_WORKER
    
    %% Worker actions
    COMMISSION_WORKER --> CALCULATE_COMM
    COMMISSION_WORKER --> CHARGE_ASAAS
    WEBHOOK_WORKER --> PROCESS_PAYMENT
    WEBHOOK_WORKER --> UPDATE_STATUS
    BATCH_WORKER --> BULK_OPERATIONS
    
    %% External interactions
    CHARGE_ASAAS --> ASAAS
    UPDATE_STATUS --> DB
    PROCESS_PAYMENT --> DB
    CALCULATE_COMM --> DB
    BULK_OPERATIONS --> DB
    UPDATE_STATUS --> EMAIL
    
    style COMMISSION_QUEUE fill:#fff3e0
    style WEBHOOK_QUEUE fill:#e8f5e8
    style BATCH_QUEUE fill:#f3e5f5
```

## Deployment Architecture

### Production Deployment Diagram

```mermaid
graph TB
    subgraph "Internet"
        USERS[Users]
        MOBILE_USERS[Mobile Users]
    end
    
    subgraph "CDN & Load Balancing"
        CLOUDFRONT[CloudFront CDN]
        ALB[Application Load Balancer]
    end
    
    subgraph "Application Tier (Multi-AZ)"
        subgraph "AZ-1"
            APP1[AdonisJS Instance 1]
            WORKER1[Queue Worker 1]
        end
        subgraph "AZ-2"
            APP2[AdonisJS Instance 2]
            WORKER2[Queue Worker 2]
        end
        subgraph "AZ-3"
            APP3[AdonisJS Instance 3]
            WORKER3[Queue Worker 3]
        end
    end
    
    subgraph "Database Tier"
        RDS_PRIMARY[(RDS Primary)]
        RDS_REPLICA[(RDS Read Replica)]
        ELASTICACHE[(ElastiCache Redis)]
    end
    
    subgraph "Storage & Services"
        S3[S3 Bucket]
        SES[SES Email]
        SECRETS[Secrets Manager]
    end
    
    subgraph "Monitoring & Logging"
        CLOUDWATCH[CloudWatch]
        XRAY[X-Ray Tracing]
    end
    
    subgraph "External Services"
        ASAAS_EXT[Asaas Payment API]
    end
    
    %% User connections
    USERS --> CLOUDFRONT
    MOBILE_USERS --> CLOUDFRONT
    CLOUDFRONT --> ALB
    
    %% Load balancing
    ALB --> APP1
    ALB --> APP2
    ALB --> APP3
    
    %% Database connections
    APP1 --> RDS_PRIMARY
    APP2 --> RDS_PRIMARY
    APP3 --> RDS_PRIMARY
    
    APP1 --> RDS_REPLICA
    APP2 --> RDS_REPLICA
    APP3 --> RDS_REPLICA
    
    %% Cache connections
    APP1 --> ELASTICACHE
    APP2 --> ELASTICACHE
    APP3 --> ELASTICACHE
    
    WORKER1 --> ELASTICACHE
    WORKER2 --> ELASTICACHE
    WORKER3 --> ELASTICACHE
    
    %% Worker database access
    WORKER1 --> RDS_PRIMARY
    WORKER2 --> RDS_PRIMARY
    WORKER3 --> RDS_PRIMARY
    
    %% Storage and services
    APP1 --> S3
    APP1 --> SES
    APP1 --> SECRETS
    
    WORKER1 --> ASAAS_EXT
    WORKER2 --> ASAAS_EXT
    WORKER3 --> ASAAS_EXT
    
    %% Monitoring
    APP1 --> CLOUDWATCH
    APP2 --> CLOUDWATCH
    APP3 --> CLOUDWATCH
    
    APP1 --> XRAY
    APP2 --> XRAY
    APP3 --> XRAY
    
    style APP1 fill:#e3f2fd
    style APP2 fill:#e3f2fd
    style APP3 fill:#e3f2fd
    style RDS_PRIMARY fill:#e8f5e8
    style ELASTICACHE fill:#fff3e0
```

### CI/CD Pipeline Flow

```mermaid
flowchart LR
    subgraph "Development"
        DEV[Developer]
        GIT[Git Repository]
    end
    
    subgraph "CI Pipeline"
        TRIGGER[Pipeline Trigger]
        CHECKOUT[Checkout Code]
        INSTALL[Install Dependencies]
        LINT[Code Linting]
        TEST[Run Tests]
        BUILD[Build Application]
        DOCKER[Build Docker Image]
    end
    
    subgraph "CD Pipeline"
        STAGING[Deploy to Staging]
        E2E[E2E Tests]
        APPROVAL[Manual Approval]
        PRODUCTION[Deploy to Production]
        HEALTH[Health Check]
    end
    
    subgraph "Infrastructure"
        ECR[ECR Registry]
        ECS_STAGING[ECS Staging]
        ECS_PROD[ECS Production]
    end
    
    %% Development flow
    DEV --> GIT
    GIT --> TRIGGER
    
    %% CI flow
    TRIGGER --> CHECKOUT
    CHECKOUT --> INSTALL
    INSTALL --> LINT
    LINT --> TEST
    TEST --> BUILD
    BUILD --> DOCKER
    
    %% CD flow
    DOCKER --> ECR
    ECR --> STAGING
    STAGING --> ECS_STAGING
    ECS_STAGING --> E2E
    E2E --> APPROVAL
    APPROVAL --> PRODUCTION
    PRODUCTION --> ECS_PROD
    ECS_PROD --> HEALTH
    
    style LINT fill:#fff3e0
    style TEST fill:#e8f5e8
    style APPROVAL fill:#f3e5f5
    style HEALTH fill:#e3f2fd
```

## Security Architecture

### Security Layers Diagram

```mermaid
graph TD
    subgraph "Network Security"
        WAF[Web Application Firewall]
        DDOS[DDoS Protection]
        VPC[VPC Network Isolation]
    end
    
    subgraph "Application Security"
        HTTPS[HTTPS Encryption]
        CORS[CORS Configuration]
        RATE_LIMIT[Rate Limiting]
        INPUT_VAL[Input Validation]
    end
    
    subgraph "Authentication & Authorization"
        JWT[JWT Tokens]
        RBAC[Role-Based Access Control]
        MFA[Multi-Factor Auth]
        SESSION[Session Management]
    end
    
    subgraph "Data Security"
        ENCRYPTION[Data Encryption at Rest]
        TRANSIT[Encryption in Transit]
        PII[PII Protection]
        BACKUP[Secure Backups]
    end
    
    subgraph "API Security"
        WEBHOOK_SIG[Webhook Signatures]
        API_KEYS[API Key Management]
        PAYLOAD_VAL[Payload Validation]
        AUDIT[Audit Logging]
    end
    
    subgraph "Infrastructure Security"
        IAM[IAM Roles]
        SECRETS_MGR[Secrets Management]
        VPN[VPN Access]
        MONITORING[Security Monitoring]
    end
    
    %% Security flow
    WAF --> HTTPS
    DDOS --> RATE_LIMIT
    VPC --> ENCRYPTION
    
    HTTPS --> JWT
    CORS --> RBAC
    RATE_LIMIT --> INPUT_VAL
    
    JWT --> WEBHOOK_SIG
    RBAC --> API_KEYS
    SESSION --> PAYLOAD_VAL
    
    ENCRYPTION --> IAM
    PII --> SECRETS_MGR
    BACKUP --> VPN
    
    AUDIT --> MONITORING
    
    style JWT fill:#e3f2fd
    style RBAC fill:#fff3e0
    style ENCRYPTION fill:#e8f5e8
    style MONITORING fill:#f3e5f5
```

### Data Flow Security

```mermaid
sequenceDiagram
    participant C as Client
    participant LB as Load Balancer
    participant API as API Server
    participant DB as Database
    participant EXT as External Service
    
    Note over C,EXT: Request Processing with Security
    
    C->>LB: HTTPS Request + JWT
    LB->>LB: WAF Check
    LB->>LB: Rate Limiting
    LB->>API: Forward Request
    
    API->>API: JWT Validation
    API->>API: Role Check (ACL)
    API->>API: Input Validation
    
    API->>DB: Encrypted Query
    DB-->>API: Encrypted Response
    
    API->>EXT: Secure API Call
    EXT-->>API: Signed Response
    API->>API: Signature Validation
    
    API-->>LB: Encrypted Response
    LB-->>C: HTTPS Response
    
    Note over API: All actions logged for audit
```

---

*These diagrams provide a comprehensive view of the gift card platform's architecture, from high-level business flows to
detailed technical implementations. Each diagram serves as a blueprint for understanding different aspects of the
system.*
