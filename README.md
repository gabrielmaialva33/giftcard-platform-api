# Gift Card Platform API

A comprehensive web platform for physical gift cards with QR Code, designed for franchisees and local businesses. This platform provides complete gift card lifecycle management with automated commission processing and real-time payment integration.

## 📋 Project Status

**Implementation Progress: 85% Complete**

- ✅ **Core Business Logic**: Fully functional gift card operations, commission system, payment integration
- ✅ **Payment Gateway**: Complete Asaas API integration with webhook processing
- ✅ **Authentication**: JWT-based authentication with role-based access control
- ⚠️ **Administrative Features**: Some establishment CRUD operations and profile management pending
- 📚 **Documentation**: Comprehensive technical documentation available in `/docs/`

## 🏗️ Architecture Overview

### Technology Stack

- **Framework**: AdonisJS v6 with TypeScript
- **Database**: PostgreSQL with Lucid ORM
- **Cache & Queue**: Redis with Bull Queue
- **Payment Gateway**: Asaas API integration
- **Authentication**: JWT with role-based access control
- **Infrastructure**: Docker, AWS-ready deployment

### Core Modules

1. **Franchisor Panel** - System administration and franchise oversight
2. **Franchisee Panel** - Gift card management and commission tracking
3. **Establishment Panel** - Card recharge and usage operations
4. **Client WebApp** - Public balance inquiry via QR Code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ LTS
- pnpm (recommended) or npm
- Docker & Docker Compose
- PostgreSQL and Redis

### Development Setup

```bash
# Clone and install
git clone <repository-url>
cd giftcard-platform-api
pnpm install

# Environment setup
cp .env.example .env
# Configure your environment variables

# Database setup
node ace migration:run
node ace db:seed

# Start development server
pnpm dev
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec app node ace migration:run

# View logs
docker-compose logs -f app
```

## 📚 Documentation

Comprehensive technical documentation is available in the `/docs/` directory:

### 🏗️ **Architecture Documentation**
- [Architecture Overview](./docs/architecture/overview.md) - System design and patterns
- [System Diagrams](./docs/architecture/diagrams.md) - Mermaid diagrams for architecture flows

### 📊 **Database Documentation**
- [Entity Relationship Diagram](./docs/database/erd.md) - Complete database schema
- [Table Specifications](./docs/database/tables.md) - Detailed table descriptions

### 🚀 **Feature Documentation**
- [Feature Checklist](./docs/features/checklist.md) - Implementation status tracking
- [Module Overview](./docs/features/modules.md) - Business module details

### 📡 **API Documentation**
- [API Endpoints](./docs/api/endpoints.md) - Complete endpoint reference
- [Authentication Guide](./docs/api/authentication.md) - Auth and authorization

### 🏢 **Module Documentation**
- [Franchisee Module](./docs/modules/franchisee.md) - Franchise management
- [Gift Card Module](./docs/modules/gift-card.md) - Gift card lifecycle
- [Payment Integration](./docs/modules/payments.md) - Asaas API integration
- [Commission Module](./docs/modules/commission.md) - Commission processing

### 🔐 **Security & Deployment**
- [Security Overview](./docs/security/overview.md) - Security measures and LGPD compliance
- [Deployment Guide](./docs/devops/deploy.md) - Production deployment instructions

## 🔑 Key Features

### ✅ **Implemented Features**

**Authentication & Authorization**
- JWT-based authentication with role-based access control
- Three-tier user system (franchisor, franchisee, establishment)
- Secure API endpoints with ACL middleware

**Gift Card Operations**
- Unique QR code generation with nanoid
- Real-time balance tracking and transaction history
- Batch gift card creation support
- Public balance inquiry (no authentication required)

**Commission System**
- Automatic commission calculation on recharges
- Asaas payment integration for commission collection
- Real-time payment status updates via webhooks
- Multiple payment methods (PIX, Boleto, Credit Card)

**Background Processing**
- Redis-based job queue for commission processing
- Webhook event processing with retry mechanisms
- Automated payment status synchronization

### ⚠️ **Partially Implemented**
- Establishment CRUD operations (creation only)
- User profile management
- Token refresh mechanism
- Advanced analytics and reporting

### ❌ **Pending Features**
- Notification system
- Advanced dashboard analytics
- Physical card printing integration
- Rate limiting implementation

## 🏛️ Business Model

### User Roles & Permissions

| Feature | Franchisor | Franchisee | Establishment |
|---------|------------|------------|---------------|
| User Management | Full CRUD | View own | View own |
| Franchisee Management | Full CRUD | View own | None |
| Establishment Management | Full CRUD | Manage owned | View own |
| Gift Cards | View all | Manage owned | Process own |
| Transactions | View all | View owned | View own |
| Commissions | View all | View owned | None |

### Gift Card Lifecycle

```
Creation → Recharge → Usage → Commission Generation → Payment Processing
```

## 🛡️ Security Features

- **Authentication**: JWT tokens with configurable expiration
- **Authorization**: Role-based access control with resource ownership validation
- **Data Protection**: Input validation, SQL injection prevention, encrypted storage
- **Payment Security**: Webhook signature validation, secure API integration
- **Compliance**: LGPD-ready data protection measures

## 📊 Database Schema

### Core Entities
- **Users**: Multi-role authentication system
- **Franchisees**: Franchise owner management with commission rates
- **Establishments**: Local business entities with payment preferences
- **Gift Cards**: Core gift card entities with QR codes and balance tracking
- **Transactions**: Complete audit trail of all gift card operations
- **Commissions**: Commission tracking with payment integration

## 🧪 Testing & Quality

```bash
# Run all tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Code formatting
pnpm format
```

## 🚢 Production Deployment

The application is production-ready with:

- **Containerization**: Docker support with multi-stage builds
- **AWS Integration**: ECS/EKS ready with Terraform configurations
- **Monitoring**: CloudWatch integration and health checks
- **Scaling**: Auto-scaling configuration for high availability
- **Security**: Production security headers and best practices

See [Deployment Guide](./docs/devops/deploy.md) for detailed instructions.

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
node ace migration:run     # Run migrations
node ace migration:rollback # Rollback migrations
node ace db:seed           # Run seeders

# Quality Assurance
pnpm test             # Run tests
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript checking
pnpm format           # Format code
```

## 📈 API Endpoints

### Base URLs
- **Development**: `http://localhost:3333`
- **API Base**: `/api/v1`
- **Webhooks**: `/webhooks`

### Key Endpoints
- `GET /health` - Health check
- `POST /api/v1/auth/login` - Authentication
- `GET /api/v1/gift-cards/balance` - Public balance check
- `POST /api/v1/gift-cards/recharge` - Gift card recharge
- `POST /api/v1/commissions/:id/charge` - Commission charging

See [API Documentation](./docs/api/endpoints.md) for complete endpoint reference.

## 🤝 Contributing

1. Check the [Feature Checklist](./docs/features/checklist.md) for pending tasks
2. Review the [Architecture Documentation](./docs/architecture/overview.md)
3. Follow the established patterns in existing modules
4. Ensure tests pass: `pnpm test && pnpm typecheck && pnpm lint`
5. Submit a pull request with clear description

## 📞 Support

- **Technical Documentation**: Check `/docs/` directory
- **API Reference**: [API Endpoints](./docs/api/endpoints.md)
- **Architecture Questions**: [Architecture Overview](./docs/architecture/overview.md)
- **Security Concerns**: [Security Documentation](./docs/security/overview.md)

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ using AdonisJS v6 and modern TypeScript patterns**