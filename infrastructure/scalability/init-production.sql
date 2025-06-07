-- Inicialización de base de datos de producción CoomÜnity
-- Este script prepara la base de datos para el entorno de producción

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS coomunity;
CREATE SCHEMA IF NOT EXISTS metrics;
CREATE SCHEMA IF NOT EXISTS audit;

-- Configurar timezone
SET timezone = 'UTC';

-- Crear tabla de métricas filosóficas
CREATE TABLE IF NOT EXISTS metrics.ayni_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    transaction_id UUID,
    ayni_score DECIMAL(3,2) NOT NULL CHECK (ayni_score >= 0 AND ayni_score <= 1),
    reciprocity_balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics.bien_comun_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    contribution_type VARCHAR(50) NOT NULL,
    impact_score DECIMAL(5,2) NOT NULL,
    community_benefit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics.vocational_alignment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    alignment_score DECIMAL(3,2) NOT NULL CHECK (alignment_score >= 0 AND alignment_score <= 1),
    vocational_path VARCHAR(100),
    satisfaction_level INTEGER CHECK (satisfaction_level >= 1 AND satisfaction_level <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_ayni_scores_user_id ON metrics.ayni_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ayni_scores_created_at ON metrics.ayni_scores(created_at);
CREATE INDEX IF NOT EXISTS idx_bien_comun_user_id ON metrics.bien_comun_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_bien_comun_created_at ON metrics.bien_comun_contributions(created_at);
CREATE INDEX IF NOT EXISTS idx_vocational_user_id ON metrics.vocational_alignment(user_id);

-- Crear funciones para métricas agregadas
CREATE OR REPLACE FUNCTION metrics.get_global_ayni_score()
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(ayni_score), 0.5)
        FROM metrics.ayni_scores
        WHERE created_at >= NOW() - INTERVAL '24 hours'
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION metrics.get_bien_comun_rate()
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            COUNT(DISTINCT user_id)::DECIMAL / NULLIF(
                (SELECT COUNT(DISTINCT user_id) FROM coomunity.users), 0
            ), 0
        )
        FROM metrics.bien_comun_contributions
        WHERE created_at >= NOW() - INTERVAL '24 hours'
    );
END;
$$ LANGUAGE plpgsql;

-- Configurar permisos
GRANT USAGE ON SCHEMA metrics TO coomunity;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA metrics TO coomunity;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA metrics TO coomunity;

-- Log de inicialización
INSERT INTO audit.system_events (event_type, description, created_at)
VALUES ('database_init', 'Production database initialized successfully', NOW())
ON CONFLICT DO NOTHING;

COMMIT;
