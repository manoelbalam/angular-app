# GUÍA DE MIGRACIÓN DE USUARIOS - AGM Platform

**Fecha:** 2025-12-17
**Versión:** 1.0
**Propósito:** Migrar usuarios desde la base de datos anterior a la nueva plataforma AGM (Supabase)

---

## 📋 RESUMEN EJECUTIVO

Esta guía detalla el proceso para migrar:
1. **Usuarios/Wallets** (archivo: `tableConvert.com_6n0ego.csv`) → Tablas: `profiles`, `broker_accounts`
2. **Inversores PAMM** (archivo: `Pamm_Investors-TwVay0.csv`) → Tablas: `pamm_funds`, `pamm_investors`

---

## 📁 ARCHIVOS DE ORIGEN

### 1. tableConvert.com_6n0ego.csv (Usuarios/Wallets)
| Columna Origen | Descripción |
|----------------|-------------|
| `uuid` | UUID único del registro wallet |
| `UserID` | UUID del usuario (referencia al perfil) |
| `Email` | Correo electrónico del usuario |
| `Names` | Nombre completo del usuario |
| `Wallet Name` | Nombre de la wallet (puede ser "null") |
| `Balance` | Balance en la wallet |
| `Balance USD` | Balance equivalente en USD |

### 2. Pamm_Investors-TwVay0.csv (Inversores PAMM)
| Columna Origen | Descripción |
|----------------|-------------|
| `Pamm` | Nombre del fondo PAMM (ej: "Legacy Alpha") |
| `Early Exit Fee` | Comisión por salida anticipada |
| `User Names` | Nombre completo del inversor |
| `Email User` | Email del inversor |
| `Initial Investment` | Inversión inicial |
| `Current Investment` | Valor actual de la inversión |
| `Total Earnings` | Ganancias totales |
| `Share Percentage` | Porcentaje de participación |
| `Status` | Estado (active/inactive) |
| `Created At` | Fecha de creación |
| `Updated At` | Fecha de actualización |

---

## 🎯 TABLAS DESTINO EN SUPABASE

### 1. Tabla: `profiles` (68 columnas)

**Columnas principales para migración:**

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | uuid | NO | - | **PK** - UUID del usuario (usar `UserID` del CSV) |
| `email` | varchar(255) | NO | - | Email del usuario |
| `full_name` | varchar(255) | YES | - | Nombre completo |
| `username` | varchar(100) | YES | - | Nombre de usuario |
| `role` | varchar(50) | YES | 'user' | Rol del usuario |
| `status` | varchar(50) | YES | 'active' | Estado de la cuenta |
| `phone` | varchar(50) | YES | - | Teléfono |
| `country` | varchar(100) | YES | - | País |
| `nombre` | varchar(255) | YES | - | Nombre (español) |
| `apellido` | varchar(255) | YES | - | Apellido |
| `pais` | varchar(255) | YES | - | País (español) |
| `broker_balance` | numeric | YES | 0 | Balance del broker |
| `kyc_status` | varchar(50) | YES | 'not_started' | Estado KYC |
| `kyc_verified` | boolean | YES | false | KYC verificado |
| `kyc_level` | integer | YES | 0 | Nivel de KYC |
| `email_verified` | boolean | YES | false | Email verificado |
| `created_at` | timestamptz | YES | now() | Fecha de creación |
| `updated_at` | timestamptz | YES | now() | Fecha de actualización |
| `metadata` | jsonb | YES | '{}' | Datos adicionales |

### 2. Tabla: `broker_accounts` (40 columnas)

**Columnas principales para migración:**

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `login` | bigint | NO | - | **PK** - Login MT5 (generar secuencial) |
| `id` | uuid | YES | gen_random_uuid() | UUID único |
| `user_id` | uuid | YES | - | **FK** → profiles.id |
| `name` | varchar(255) | NO | - | Nombre del titular |
| `email` | varchar(255) | YES | - | Email |
| `phone` | varchar(50) | YES | - | Teléfono |
| `country` | varchar(3) | YES | - | Código país ISO |
| `account_type` | varchar(50) | YES | 'standard' | Tipo: 'Market Direct', 'Institucional', 'demo' |
| `status` | varchar(50) | YES | 'active' | Estado de la cuenta |
| `kyc_status` | varchar(50) | YES | 'not_required' | Estado KYC |
| `leverage` | integer | YES | 100 | Apalancamiento |
| `balance` | numeric | YES | 0 | Balance actual |
| `equity` | numeric | YES | 0 | Equity |
| `currency` | varchar(10) | YES | 'USD' | Moneda |
| `group_name` | varchar(100) | YES | - | Grupo MT5 |
| `created_at` | timestamptz | YES | now() | Fecha de creación |
| `is_verified` | boolean | YES | false | Cuenta verificada |
| `metadata` | jsonb | YES | '{}' | Datos adicionales |

### 3. Tabla: `pamm_funds` (45 columnas)

**Columnas principales para migración:**

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | **PK** - ID del fondo |
| `name` | text | NO | - | Nombre del fondo (ej: "Legacy Alpha") |
| `description` | text | YES | - | Descripción |
| `manager_id` | uuid | NO | - | **FK** → profiles.id del manager |
| `manager_mt5_account_id` | text | NO | - | ID cuenta MT5 del manager |
| `min_investment` | numeric | YES | 100.00 | Inversión mínima |
| `max_investment` | numeric | YES | - | Inversión máxima |
| `current_aum` | numeric | YES | 0.00 | AUM actual |
| `performance_fee` | numeric | YES | - | Comisión por rendimiento (0-0.50) |
| `management_fee` | numeric | YES | - | Comisión de gestión (0-0.10) |
| `status` | text | YES | 'active' | Estado |
| `total_return` | numeric | YES | 0.00 | Retorno total |
| `risk_level` | text | YES | 'Medium' | Nivel de riesgo |
| `fund_type` | text | YES | 'Nuevo' | Tipo: 'Premium', 'Verificado', 'Nuevo', 'Standard' |
| `investor_count` | integer | YES | 0 | Cantidad de inversores |
| `created_at` | timestamptz | YES | now() | Fecha de creación |

### 4. Tabla: `pamm_investors` (13 columnas)

**Columnas principales para migración:**

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | **PK** |
| `fund_id` | uuid | NO | - | **FK** → pamm_funds.id |
| `investor_id` | uuid | NO | - | **FK** → profiles.id |
| `investor_mt5_account_id` | text | NO | - | ID cuenta MT5 del inversor |
| `invested_amount` | numeric | NO | - | Monto invertido (>0) |
| `current_value` | numeric | YES | 0.00 | Valor actual |
| `profit_loss` | numeric | YES | 0.00 | Ganancia/Pérdida |
| `status` | text | YES | 'pending' | Estado: 'active', 'inactive', 'pending', 'withdrawn' |
| `joined_at` | timestamptz | YES | now() | Fecha de ingreso |
| `left_at` | timestamptz | YES | - | Fecha de salida |
| `profit_handling` | varchar(20) | YES | 'compound' | Manejo: 'compound', 'withdraw', 'partial' |
| `reinvest_percentage` | numeric | YES | 100.00 | % a reinvertir (0-100) |

---

## 🔄 MAPEO DE CAMPOS

### MIGRACIÓN 1: Users/Wallets → profiles

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSV: tableConvert.com_6n0ego.csv             │
├─────────────────────────────────────────────────────────────────┤
│ UserID          ──────────────────────►  profiles.id            │
│ Email           ──────────────────────►  profiles.email         │
│ Names           ──────────────────────►  profiles.full_name     │
│ Names (split)   ──────────────────────►  profiles.nombre        │
│ Names (split)   ──────────────────────►  profiles.apellido      │
│ Balance USD     ──────────────────────►  profiles.broker_balance│
│ (generado)      ──────────────────────►  profiles.username      │
│ 'user'          ──────────────────────►  profiles.role          │
│ 'active'        ──────────────────────►  profiles.status        │
│ 'not_started'   ──────────────────────►  profiles.kyc_status    │
│ false           ──────────────────────►  profiles.kyc_verified  │
│ now()           ──────────────────────►  profiles.created_at    │
│ { source:'migration', wallet_uuid: uuid }                       │
│                 ──────────────────────►  profiles.metadata      │
└─────────────────────────────────────────────────────────────────┘
```

### MIGRACIÓN 2: Users/Wallets → broker_accounts (opcional)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSV: tableConvert.com_6n0ego.csv             │
├─────────────────────────────────────────────────────────────────┤
│ (generar seq)   ──────────────────────►  broker_accounts.login  │
│ uuid            ──────────────────────►  broker_accounts.id     │
│ UserID          ──────────────────────►  broker_accounts.user_id│
│ Names           ──────────────────────►  broker_accounts.name   │
│ Email           ──────────────────────►  broker_accounts.email  │
│ Balance USD     ──────────────────────►  broker_accounts.balance│
│ 'Market Direct' ──────────────────────►  broker_accounts.account_type│
│ 'active'        ──────────────────────►  broker_accounts.status │
│ 'USD'           ──────────────────────►  broker_accounts.currency│
│ 100             ──────────────────────►  broker_accounts.leverage│
│ now()           ──────────────────────►  broker_accounts.created_at│
└─────────────────────────────────────────────────────────────────┘
```

### MIGRACIÓN 3: PAMM Investors → pamm_funds + pamm_investors

#### Paso 3.1: Crear fondo PAMM "Legacy Alpha"
```
┌─────────────────────────────────────────────────────────────────┐
│                    Crear Fondo PAMM                             │
├─────────────────────────────────────────────────────────────────┤
│ uuid_generate_v4()  ─────────────────►  pamm_funds.id           │
│ 'Legacy Alpha'      ─────────────────►  pamm_funds.name         │
│ 'Fondo migrado'     ─────────────────►  pamm_funds.description  │
│ [MANAGER_UUID]      ─────────────────►  pamm_funds.manager_id   │
│ [MANAGER_MT5_ID]    ─────────────────►  pamm_funds.manager_mt5_account_id│
│ 'active'            ─────────────────►  pamm_funds.status       │
│ SUM(Current Investment)                                         │
│                     ─────────────────►  pamm_funds.current_aum  │
│ COUNT(investors)    ─────────────────►  pamm_funds.investor_count│
│ Early Exit Fee      ─────────────────►  pamm_funds.performance_fee│
└─────────────────────────────────────────────────────────────────┘
```

#### Paso 3.2: Insertar Inversores PAMM
```
┌─────────────────────────────────────────────────────────────────┐
│                    CSV: Pamm_Investors-TwVay0.csv               │
├─────────────────────────────────────────────────────────────────┤
│ uuid_generate_v4()  ─────────────────►  pamm_investors.id       │
│ [FUND_UUID]         ─────────────────►  pamm_investors.fund_id  │
│ [USER_UUID por Email]                                           │
│                     ─────────────────►  pamm_investors.investor_id│
│ [MT5_ACCOUNT_ID]    ─────────────────►  pamm_investors.investor_mt5_account_id│
│ Initial Investment  ─────────────────►  pamm_investors.invested_amount│
│ Current Investment  ─────────────────►  pamm_investors.current_value│
│ Total Earnings      ─────────────────►  pamm_investors.profit_loss│
│ Status (normalizado)─────────────────►  pamm_investors.status   │
│ Created At          ─────────────────►  pamm_investors.joined_at│
│ 'compound'          ─────────────────►  pamm_investors.profit_handling│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 SCRIPTS SQL DE MIGRACIÓN

### PASO 1: Crear tabla temporal para usuarios

```sql
-- 1.1 Crear tabla temporal de staging
CREATE TABLE IF NOT EXISTS migration_users_staging (
    uuid UUID,
    user_id UUID,
    email VARCHAR(255),
    names VARCHAR(255),
    wallet_name VARCHAR(255),
    balance NUMERIC,
    balance_usd NUMERIC,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT
);

-- 1.2 Importar CSV (ejecutar desde psql o Supabase Dashboard)
-- COPY migration_users_staging(uuid, user_id, email, names, wallet_name, balance, balance_usd)
-- FROM '/path/to/tableConvert.com_6n0ego.csv'
-- WITH CSV HEADER;
```

### PASO 2: Migrar usuarios a profiles

```sql
-- 2.1 Insertar usuarios únicos en profiles
INSERT INTO profiles (
    id,
    email,
    full_name,
    username,
    role,
    status,
    kyc_status,
    kyc_verified,
    broker_balance,
    created_at,
    updated_at,
    metadata
)
SELECT DISTINCT ON (user_id)
    user_id AS id,
    LOWER(TRIM(email)) AS email,
    TRIM(names) AS full_name,
    -- Generar username basado en email
    SPLIT_PART(LOWER(TRIM(email)), '@', 1) AS username,
    'user' AS role,
    'active' AS status,
    'not_started' AS kyc_status,
    FALSE AS kyc_verified,
    COALESCE(balance_usd, 0) AS broker_balance,
    NOW() AS created_at,
    NOW() AS updated_at,
    jsonb_build_object(
        'migration_source', 'legacy_db',
        'original_wallet_uuid', uuid,
        'migrated_at', NOW()
    ) AS metadata
FROM migration_users_staging
WHERE user_id IS NOT NULL
  AND email IS NOT NULL
  AND email != ''
ON CONFLICT (id) DO UPDATE SET
    broker_balance = EXCLUDED.broker_balance,
    metadata = profiles.metadata || EXCLUDED.metadata,
    updated_at = NOW();
```

### PASO 3: Crear tabla temporal para PAMM investors

```sql
-- 3.1 Crear tabla temporal de staging
CREATE TABLE IF NOT EXISTS migration_pamm_staging (
    pamm_name VARCHAR(255),
    early_exit_fee NUMERIC,
    user_names VARCHAR(255),
    email_user VARCHAR(255),
    initial_investment NUMERIC,
    current_investment NUMERIC,
    total_earnings NUMERIC,
    share_percentage NUMERIC,
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT
);

-- 3.2 Importar CSV
-- COPY migration_pamm_staging(pamm_name, early_exit_fee, user_names, email_user,
--      initial_investment, current_investment, total_earnings, share_percentage,
--      status, created_at, updated_at)
-- FROM '/path/to/Pamm_Investors-TwVay0.csv'
-- WITH CSV HEADER;
```

### PASO 4: Crear fondo PAMM "Legacy Alpha"

```sql
-- 4.1 Calcular AUM total
WITH fund_stats AS (
    SELECT
        SUM(current_investment) AS total_aum,
        COUNT(*) AS investor_count,
        MAX(early_exit_fee) AS exit_fee
    FROM migration_pamm_staging
    WHERE pamm_name = 'Legacy Alpha'
)
-- 4.2 Insertar fondo (REQUIERE: manager_id y manager_mt5_account_id reales)
INSERT INTO pamm_funds (
    id,
    name,
    description,
    manager_id,                -- REEMPLAZAR con UUID del manager real
    manager_mt5_account_id,    -- REEMPLAZAR con ID MT5 del manager
    min_investment,
    current_aum,
    performance_fee,
    status,
    fund_type,
    investor_count,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    'Legacy Alpha',
    'Fondo migrado desde plataforma anterior',
    '00000000-0000-0000-0000-000000000000'::UUID,  -- CAMBIAR
    '000000',  -- CAMBIAR: Login MT5 del manager
    100.00,
    fs.total_aum,
    COALESCE(fs.exit_fee / 100, 0.20),  -- Convertir a decimal
    'active',
    'Verificado',
    fs.investor_count,
    NOW(),
    NOW()
FROM fund_stats fs;
```

### PASO 5: Migrar inversores PAMM

```sql
-- 5.1 Primero, asegurar que todos los inversores existen en profiles
INSERT INTO profiles (id, email, full_name, role, status)
SELECT DISTINCT
    uuid_generate_v4(),
    LOWER(TRIM(email_user)),
    TRIM(user_names),
    'user',
    'active'
FROM migration_pamm_staging mps
WHERE NOT EXISTS (
    SELECT 1 FROM profiles p
    WHERE LOWER(p.email) = LOWER(TRIM(mps.email_user))
)
AND email_user IS NOT NULL
AND email_user != '';

-- 5.2 Insertar inversores PAMM
INSERT INTO pamm_investors (
    id,
    fund_id,
    investor_id,
    investor_mt5_account_id,
    invested_amount,
    current_value,
    profit_loss,
    status,
    joined_at,
    profit_handling,
    reinvest_percentage
)
SELECT
    uuid_generate_v4(),
    pf.id AS fund_id,
    p.id AS investor_id,
    COALESCE(ba.login::TEXT, 'PENDING_' || p.id::TEXT) AS investor_mt5_account_id,
    mps.initial_investment,
    mps.current_investment,
    COALESCE(mps.total_earnings, mps.current_investment - mps.initial_investment),
    CASE
        WHEN LOWER(mps.status) = 'active' THEN 'active'
        WHEN LOWER(mps.status) = 'inactive' THEN 'inactive'
        ELSE 'pending'
    END AS status,
    COALESCE(mps.created_at, NOW()) AS joined_at,
    'compound' AS profit_handling,
    100.00 AS reinvest_percentage
FROM migration_pamm_staging mps
JOIN profiles p ON LOWER(p.email) = LOWER(TRIM(mps.email_user))
JOIN pamm_funds pf ON pf.name = mps.pamm_name
LEFT JOIN broker_accounts ba ON ba.user_id = p.id
WHERE mps.initial_investment > 0;
```

### PASO 6: Actualizar estadísticas del fondo

```sql
-- 6.1 Actualizar AUM y contador de inversores
UPDATE pamm_funds pf
SET
    current_aum = (
        SELECT COALESCE(SUM(current_value), 0)
        FROM pamm_investors pi
        WHERE pi.fund_id = pf.id AND pi.status = 'active'
    ),
    investor_count = (
        SELECT COUNT(*)
        FROM pamm_investors pi
        WHERE pi.fund_id = pf.id AND pi.status = 'active'
    ),
    updated_at = NOW()
WHERE pf.name = 'Legacy Alpha';
```

---

## ⚠️ VALIDACIONES PRE-MIGRACIÓN

### Verificar datos de origen

```sql
-- Contar registros por archivo
SELECT 'Users/Wallets' AS source, COUNT(*) AS total FROM migration_users_staging
UNION ALL
SELECT 'PAMM Investors', COUNT(*) FROM migration_pamm_staging;

-- Verificar emails duplicados en usuarios
SELECT email, COUNT(*)
FROM migration_users_staging
GROUP BY email
HAVING COUNT(*) > 1;

-- Verificar inversores sin email válido
SELECT * FROM migration_pamm_staging
WHERE email_user IS NULL OR email_user = '' OR email_user NOT LIKE '%@%';

-- Verificar inversiones con monto <= 0
SELECT * FROM migration_pamm_staging
WHERE initial_investment <= 0;
```

---

## ✅ VALIDACIONES POST-MIGRACIÓN

```sql
-- 1. Verificar perfiles creados
SELECT COUNT(*) AS profiles_migrated FROM profiles
WHERE metadata->>'migration_source' = 'legacy_db';

-- 2. Verificar fondo PAMM
SELECT id, name, current_aum, investor_count
FROM pamm_funds WHERE name = 'Legacy Alpha';

-- 3. Verificar inversores PAMM
SELECT
    pf.name AS fund_name,
    COUNT(*) AS investors,
    SUM(pi.invested_amount) AS total_invested,
    SUM(pi.current_value) AS total_current,
    SUM(pi.profit_loss) AS total_pnl
FROM pamm_investors pi
JOIN pamm_funds pf ON pi.fund_id = pf.id
GROUP BY pf.name;

-- 4. Verificar integridad de FKs
SELECT pi.*
FROM pamm_investors pi
LEFT JOIN profiles p ON pi.investor_id = p.id
WHERE p.id IS NULL;

-- 5. Comparar totales con CSV original
SELECT
    (SELECT SUM(initial_investment) FROM migration_pamm_staging) AS csv_initial,
    (SELECT SUM(invested_amount) FROM pamm_investors) AS db_invested,
    (SELECT SUM(current_investment) FROM migration_pamm_staging) AS csv_current,
    (SELECT SUM(current_value) FROM pamm_investors) AS db_current;
```

---

## 🔐 CONSIDERACIONES DE SEGURIDAD

1. **Supabase Auth**: Los usuarios migrados NO tendrán cuenta en `auth.users`. Deberán:
   - Registrarse manualmente, o
   - Usar flujo de "recuperar contraseña" para crear credenciales

2. **RLS Policies**: Las tablas tienen Row Level Security. Verificar que:
   - El usuario de migración tenga permisos `service_role`
   - Las políticas permitan las operaciones de INSERT

3. **MT5 Account IDs**: Los `investor_mt5_account_id` deben existir o crearse:
   - Si no existen, usar placeholder temporal
   - Crear cuentas MT5 posteriormente y actualizar

---

## 📊 RESUMEN DE DATOS A MIGRAR

| Fuente | Registros | Tabla Destino |
|--------|-----------|---------------|
| tableConvert CSV | ~varios | profiles |
| tableConvert CSV | ~varios | broker_accounts (opcional) |
| Pamm_Investors CSV | 94 | profiles (nuevos) |
| Pamm_Investors CSV | 94 | pamm_investors |
| - | 1 | pamm_funds ("Legacy Alpha") |

---

## 🔄 ORDEN DE EJECUCIÓN

1. ✅ Crear tablas de staging
2. ✅ Importar CSVs a tablas de staging
3. ✅ Validar datos de origen
4. ✅ Migrar usuarios a `profiles`
5. ✅ (Opcional) Crear `broker_accounts`
6. ✅ Crear fondo PAMM "Legacy Alpha"
7. ✅ Asegurar que inversores existen en `profiles`
8. ✅ Migrar inversores a `pamm_investors`
9. ✅ Actualizar estadísticas del fondo
10. ✅ Ejecutar validaciones post-migración
11. ✅ Eliminar tablas de staging

---

## 🧹 LIMPIEZA POST-MIGRACIÓN

```sql
-- Eliminar tablas de staging después de validar
DROP TABLE IF EXISTS migration_users_staging;
DROP TABLE IF EXISTS migration_pamm_staging;
```

---

## 📞 CONTACTO

Para dudas sobre esta migración, revisar:
- Esquema completo: `/home/rdpuser/Desktop/Proyectos/AGM/full-schema.txt`
- Queries de verificación: `/home/rdpuser/Desktop/Proyectos/AGM/supabase_verification_queries.sql`