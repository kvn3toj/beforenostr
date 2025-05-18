-- Crear tabla playlist_items
CREATE TABLE IF NOT EXISTS public.playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL DEFAULT 'video_embed',
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.playlist_items IS 'Stores individual items (videos, quizzes, etc.) within a playlist.';
COMMENT ON COLUMN public.playlist_items.playlist_id IS 'The playlist this item belongs to.';
COMMENT ON COLUMN public.playlist_items.item_type IS 'Type of content (e.g., video_embed, quiz).';
COMMENT ON COLUMN public.playlist_items.content IS 'The actual content data (e.g., iframe code, quiz JSON).';
COMMENT ON COLUMN public.playlist_items.order_index IS 'Order of the item within its playlist.';

-- Crear índice para buscar items por playlist
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_id ON public.playlist_items (playlist_id, order_index);
