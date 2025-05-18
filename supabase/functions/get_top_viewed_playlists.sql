CREATE OR REPLACE FUNCTION get_top_viewed_playlists(limit_param integer)
RETURNS TABLE (
  id uuid,
  name text,
  view_count bigint,
  thumbnail_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    COUNT(pv.id) as view_count,
    p.thumbnail_url
  FROM playlists p
  LEFT JOIN playlist_views pv ON p.id = pv.playlist_id
  GROUP BY p.id, p.name, p.thumbnail_url
  ORDER BY view_count DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql; 