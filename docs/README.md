# Gift Card Platform Documentation

## Overview

This is a comprehensive gift card platform built with AdonisJS v6, designed for franchisees to manage gift card
operations for local establishments. The platform supports gift card creation, recharge, usage tracking, commission
calculations, and automated payment processing through Asaas API integration.

## Architecture

- **Framework**: AdonisJS v6 with TypeScript
- **Database**: PostgreSQL with Lucid ORM
- **Queue System**: Bull Queue with Redis
- **Authentication**: JWT with role-based access control
- **Payment Integration**: Asaas API
- **Testing**: Japa test runner

## Documentation Structure

### 🏗️ Architecture Documentation

- [**Architecture Overview**](./architecture/overview.md) - System architecture and design patterns
- [**System Diagrams**](./architecture/diagrams.md) - Mermaid diagrams for architecture and flows

### 📊 Database Documentation

- [**Entity Relationship Diagram**](./database/erd.md) - Database schema with Mermaid ERD
- [**Table Specifications**](./database/tables.md) - Detailed table descriptions and relationships

### 🚀 Features Documentation

- [**Feature Checklist**](./features/checklist.md) - Implementation status and pending features
- [**Module Overview**](./features/modules.md) - Detailed module functionality

### 📡 API Documentation

- [**API Endpoints**](./api/endpoints.md) - Complete endpoint documentation with examples
- [**Authentication**](./api/authentication.md) - Authentication and authorization guide

### 🏢 Module Documentation

- [**Franchisee Module**](./modules/franchisee.md) - Franchisee management functionality
- [**Establishment Module**](./modules/establishment.md) - Establishment operations
- [**Gift Card Module**](./modules/gift-card.md) - Gift card lifecycle management
- [**Commission Module**](./modules/commission.md) - Commission calculation and payment processing
- [**Payment Integration**](./modules/payments.md) - Asaas API integration details
- [**User Management**](./modules/user.md) - User roles and management

### 🔐 Security Documentation

- [**Security Overview**](./security/overview.md) - Security measures, LGPD compliance, and best practices
- [**Access Control**](./security/access-control.md) - Role-based permissions and ACL

### 🚀 DevOps Documentation

- [**Deployment Guide**](./devops/deploy.md) - Production deployment instructions
- [**Best Practices**](./devops/best-practices.md) - Development and operational guidelines

## Quick Start

1. **Setup Environment**
   ```bash
   pnpm install
   cp .env.example .env
   # Configure your environment variables
   ```

2. **Database Setup**
   ```bash
   node ace migration:run
   node ace db:seed
   ```

3. **Development**
   ```bash
   pnpm dev
   ```

4. **Testing**
   ```bash
   pnpm test
   pnpm lint
   pnpm typecheck
   ```

## User Roles

The platform supports three main user roles:

- **FRANCHISOR**: System administrators with full access
- **FRANCHISEE**: Franchise owners managing gift cards and establishments
- **ESTABLISHMENT**: Local businesses that handle gift card recharges and usage

## Key Features

### ✅ Implemented Features

- User authentication and role-based access control
- Franchisee management (full CRUD operations)
- Gift card creation, recharge, and usage tracking
- Transaction recording and reporting
- Commission calculation and automated charging
- Asaas payment integration with webhook processing
- Queue-based background job processing

### ⚠️ Partially Implemented

- Establishment management (missing CRUD operations)
- User profile management
- Advanced reporting features

### ❌ Pending Features

- Notification system
- Analytics dashboard
- Advanced reporting
- Physical card printing integration

## Project Status

**Overall Implementation: ~85% Complete**

The core business logic is fully functional with robust payment integration. Missing pieces are primarily administrative
features rather than core gift card operations.

## Support

For technical questions or issues:

- Check the module-specific documentation in `/docs/modules/`
- Review the API documentation in `/docs/api/`
- Consult the troubleshooting section in each module

---

*Last updated: Jun 2025*
