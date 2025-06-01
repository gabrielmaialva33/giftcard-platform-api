# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run all test suites
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

### Database Commands

- `node ace migration:run` - Run database migrations
- `node ace migration:rollback` - Rollback migrations
- `node ace db:seed` - Run database seeders

### Testing Commands

- `node ace test` - Run all tests
- `node ace test --files tests/unit/**/*.spec.ts` - Run unit tests only
- `node ace test --files tests/functional/**/*.spec.ts` - Run functional tests only

## Architecture Overview

This is an AdonisJS v6 application implementing a gift card platform with modular architecture.

### Core Technologies

- **Framework**: AdonisJS v6 with TypeScript
- **Database**: PostgreSQL with Lucid ORM
- **Queue**: Bull Queue with Redis
- **Authentication**: JWT with custom guards
- **Payment**: Asaas API integration
- **Testing**: Japa test runner

### Module-Based Architecture

The application follows a modular structure under `app/modules/`:

- **auth** - Authentication and authorization
- **user** - User management with roles (franchisor, franchisee, establishment)
- **franchisee** - Franchisee management
- **establishment** - Establishment management
- **gift-card** - Gift card creation, recharge, and usage
- **transaction** - Transaction tracking
- **commission** - Commission calculations and processing
- **webhook** - Webhook handling for payment events
- **asaas** - Payment gateway integration

### Key Patterns

Each module typically contains:
- `controllers/` - HTTP request handlers
- `services/` - Business logic separated by use case
- `models/` - Database models
- `repositories/` - Data access layer
- `validators/` - Request validation schemas
- `routes/` - Route definitions
- `interfaces/` - TypeScript interfaces

### User Role System

The platform supports three user roles defined in `UserRole` enum:
- `FRANCHISOR` - System administrators
- `FRANCHISEE` - Franchise owners managing gift cards
- `ESTABLISHMENT` - Local businesses using gift cards

### Path Aliases

The project uses extensive path aliases defined in package.json imports:
- `#modules/*` - App modules
- `#shared/*` - Shared services
- `#extensions/*` - Custom extensions
- `#jobs/*` - Background jobs
- Standard AdonisJS aliases for controllers, models, services, etc.

### Queue System

Background jobs are implemented using Bull Queue:
- `commission-charge.job.ts` - Process commission charges
- `process-pending-commissions.job.ts` - Handle pending commissions
- `process-webhook.job.ts` - Process webhook events

### Extensions

Custom extensions in `app/extensions/`:
- `logged-user.extension.ts` - Extends HttpContext with loggedUser property

### Database

Uses PostgreSQL with migrations in `database/migrations/` covering:
- User management with access tokens
- Franchisee and establishment hierarchy
- Gift cards with transaction history
- Commission tracking
- Payment webhooks
- Establishment payment methods

Always run `pnpm lint` and `pnpm typecheck` after making changes to ensure code quality.