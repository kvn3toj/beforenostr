create table playlist_versions (
  id uuid default uuid_generate_v4() primary key,
  playlist_id uuid references playlists(id) on delete cascade,
  version integer not null,
  timestamp timestamptz not null default now(),
  changed_by_user_id uuid references auth.users(id),
  name text not null,
  description text,
  mundo_id uuid references mundos(id),
  order_index integer not null,
  is_active boolean not null,
  published_at timestamptz,
  unpublished_at timestamptz
);

-- Add indexes for better performance
create index playlist_versions_playlist_id_idx on playlist_versions(playlist_id);
create index playlist_versions_version_idx on playlist_versions(version); 