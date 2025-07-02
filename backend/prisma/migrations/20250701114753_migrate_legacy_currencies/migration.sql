-- This migration updates legacy currency values in the `marketplace_items` table
-- to the new `UNITS` standard before the schema-altering enum change is applied.
-- This prevents the "enum cast" error during deployment.

-- Update 'LUKAS' to 'UNITS'
UPDATE "marketplace_items" SET "currency" = 'UNITS' WHERE "currency" = 'LUKAS';

-- Update other potential legacy currencies to 'UNITS' or handle as needed
UPDATE "marketplace_items" SET "currency" = 'UNITS' WHERE "currency" = 'USD';
UPDATE "marketplace_items" SET "currency" = 'UNITS' WHERE "currency" = 'EUR';
UPDATE "marketplace_items" SET "currency" = 'UNITS' WHERE "currency" = 'BTC';
UPDATE "marketplace_items" SET "currency" = 'UNITS' WHERE "currency" = 'ETH';
