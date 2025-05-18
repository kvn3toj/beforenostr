-- Crear tabla playlist_items si no existe (en caso de que no se haya aplicado la migración anterior)
CREATE TABLE IF NOT EXISTS public.playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL DEFAULT 'video_embed',
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice para buscar items por playlist si no existe
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_id ON public.playlist_items (playlist_id, order_index);

-- Crear tabla categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- Nombre de categoría único
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
  -- Podríamos añadir created_by si es necesario
);
COMMENT ON TABLE public.categories IS 'Global list of categories for playlist items.';

-- Crear tabla de unión playlist_item_categories (Muchos a Muchos)
CREATE TABLE IF NOT EXISTS public.playlist_item_categories (
  item_id UUID NOT NULL REFERENCES public.playlist_items(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, category_id) -- Clave primaria compuesta
);
COMMENT ON TABLE public.playlist_item_categories IS 'Associates playlist items with categories.';

-- Índices
CREATE INDEX IF NOT EXISTS idx_playlist_item_categories_item_id ON public.playlist_item_categories (item_id);
CREATE INDEX IF NOT EXISTS idx_playlist_item_categories_category_id ON public.playlist_item_categories (category_id); 