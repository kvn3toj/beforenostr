create table mundo_versions (
  id uuid default uuid_generate_v4() primary key,
  mundo_id uuid references mundos(id) on delete cascade,
  version integer not null,
  timestamp timestamptz not null default now(),
  changed_by_user_id uuid references auth.users(id),
  name text not null,
  description text,
  thumbnail_url text,
  is_active boolean not null,
  published_at timestamptz,
  unpublished_at timestamptz
);

-- Add indexes for better performance
create index mundo_versions_mundo_id_idx on mundo_versions(mundo_id);
create index mundo_versions_version_idx on mundo_versions(version); 