-- Add scheduling fields to mundos table
ALTER TABLE mundos
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS unpublished_at TIMESTAMPTZ;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mundos_published_at ON mundos(published_at);
CREATE INDEX IF NOT EXISTS idx_mundos_unpublished_at ON mundos(unpublished_at);

-- Add comment to explain the fields
COMMENT ON COLUMN mundos.published_at IS 'When the mundo will be published. If null, the mundo is not scheduled for publication.';
COMMENT ON COLUMN mundos.unpublished_at IS 'When the mundo will be unpublished. If null, the mundo is not scheduled for unpublication.'; 