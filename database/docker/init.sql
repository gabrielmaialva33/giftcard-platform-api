-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar TimescaleDB
SELECT timescaledb_pre_restore();
SELECT timescaledb_post_restore();
