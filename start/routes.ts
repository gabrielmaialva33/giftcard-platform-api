/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Import module routes
import { authRoutes } from '#modules/auth/routes/index.js'
import { franchiseeRoutes } from '#modules/franchisee/routes/index.js'
import { establishmentRoutes } from '#modules/establishment/routes/index.js'
import { giftCardRoutes } from '#modules/gift-card/routes/index.js'
import { transactionRoutes } from '#modules/transaction/routes/index.js'
import { commissionRoutes } from '#modules/commission/routes/index.js'
import { webhookRoutes } from '#modules/webhook/routes/index.js'

// Health check
router.get('/', async () => {
  return {
    name: 'Gift Card Platform API',
    version: '1.0.0',
    status: 'active',
    environment: process.env.NODE_ENV,
  }
})

router.get('/health', async ({ response }) => {
  return response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// API v1 routes
router
  .group(() => {
    // Auth routes
    authRoutes()

    // Franchisee routes
    franchiseeRoutes()

    // Gift card routes
    giftCardRoutes()

    // Establishment routes
    establishmentRoutes()

    // Transaction routes
    transactionRoutes()

    // Commission routes
    commissionRoutes()
  })
  .prefix('api/v1')

// Webhook routes (outside API version prefix)
webhookRoutes()
