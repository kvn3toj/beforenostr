-- Seed Roles
INSERT INTO "roles" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'admin', 'Administrator role', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO "roles" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'user', 'Regular user role', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO "roles" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'premium', 'Premium user role', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO "roles" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'creator', 'Content creator role', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO "roles" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'moderator', 'Moderator role', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;

-- Seed Users (passwords are 'admin123' and '123456' hashed with bcrypt)
-- You MUST use a proper bcrypt library in your app to verify these
-- Pass: admin123
INSERT INTO "users" (id, email, name, password, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'admin@gamifier.com', 'Admin', '$2b$10$HD2mHiAbcfRdstITNa0twOjM4OLmj3vyAJ8u/SNSseXZKNxBOu3gm', NOW(), NOW()) ON CONFLICT (email) DO NOTHING;
-- Pass: 123456
INSERT INTO "users" (id, email, name, password, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'user@gamifier.com', 'Regular User', '$2b$10$KAX.eC4kM6s/n2kjV1AIA.A.lBpcLw3beiuO8BCQWp3vAd9Lswq3e', NOW(), NOW()) ON CONFLICT (email) DO NOTHING;
INSERT INTO "users" (id, email, name, password, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'premium@gamifier.com', 'Premium User', '$2b$10$KAX.eC4kM6s/n2kjV1AIA.A.lBpcLw3beiuO8BCQWp3vAd9Lswq3e', NOW(), NOW()) ON CONFLICT (email) DO NOTHING;
INSERT INTO "users" (id, email, name, password, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'creator@gamifier.com', 'Content Creator', '$2b$10$KAX.eC4kM6s/n2kjV1AIA.A.lBpcLw3beiuO8BCQWp3vAd9Lswq3e', NOW(), NOW()) ON CONFLICT (email) DO NOTHING;
INSERT INTO "users" (id, email, name, password, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'moderator@gamifier.com', 'Moderator', '$2b$10$KAX.eC4kM6s/n2kjV1AIA.A.lBpcLw3beiuO8BCQWp3vAd9Lswq3e', NOW(), NOW()) ON CONFLICT (email) DO NOTHING;

-- Associate Roles with Users
INSERT INTO "user_roles" ("userId", "roleId")
SELECT u.id, r.id FROM "users" u, "roles" r WHERE u.email = 'admin@gamifier.com' AND r.name = 'admin'
ON CONFLICT ("userId", "roleId") DO NOTHING;

INSERT INTO "user_roles" ("userId", "roleId")
SELECT u.id, r.id FROM "users" u, "roles" r WHERE u.email = 'user@gamifier.com' AND r.name = 'user'
ON CONFLICT ("userId", "roleId") DO NOTHING;

-- Seed UPlay related data
-- This is a simplified version. A real scenario might need more complex relations.
DO $$
DECLARE
    mundo_id "mundos".id%TYPE;
    playlist_id "playlists".id%TYPE;
    item_type_id "item_types".id%TYPE;
BEGIN
    -- Ensure a default Mundo exists
    SELECT id INTO mundo_id FROM "mundos" WHERE name = 'UPlay Zone' LIMIT 1;
    IF mundo_id IS NULL THEN
        INSERT INTO "mundos" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'UPlay Zone', 'Mundo para videos interactivos de UPlay', NOW(), NOW()) RETURNING id INTO mundo_id;
    END IF;

    -- Ensure a default Playlist exists
    SELECT id INTO playlist_id FROM "playlists" WHERE name = 'Videos Principales UPlay' LIMIT 1;
    IF playlist_id IS NULL THEN
        INSERT INTO "playlists" (id, name, description, "mundoId", "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'Videos Principales UPlay', 'Contenido principal de UPlay', mundo_id, NOW(), NOW()) RETURNING id INTO playlist_id;
    END IF;

    -- Ensure a default ItemType for videos exists
    SELECT id INTO item_type_id FROM "item_types" WHERE name = 'Video' LIMIT 1;
    IF item_type_id IS NULL THEN
        INSERT INTO "item_types" (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), 'Video', 'Elemento de tipo video para UPlay', NOW(), NOW()) RETURNING id INTO item_type_id;
    END IF;

    -- Seed videos
    IF NOT EXISTS (SELECT 1 FROM "video_items" WHERE title = 'Coomunity: La Vision del Futuro') THEN
        INSERT INTO "video_items" (title, description, content, "externalId", "thumbnailUrl", duration, "playlistId", "itemTypeId", categories, platform, language, "createdAt", "updatedAt") VALUES
        ('Coomunity: La Vision del Futuro', 'Descubre la visión y misión de Coomunity para construir un futuro colaborativo.', 'Descubre la visión y misión de Coomunity para construir un futuro colaborativo.', 'dQw4w9WgXcQ', 'https://i3.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 212, playlist_id, item_type_id, 'Introducción', 'youtube', 'es', NOW(), NOW());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "video_items" WHERE title = 'Ayni: El Arte de la Reciprocidad') THEN
        INSERT INTO "video_items" (title, description, content, "externalId", "thumbnailUrl", duration, "playlistId", "itemTypeId", categories, platform, language, "createdAt", "updatedAt") VALUES
        ('Ayni: El Arte de la Reciprocidad', 'Un documental profundo sobre el principio ancestral del Ayni y su aplicación moderna.', 'Un documental profundo sobre el principio ancestral del Ayni y su aplicación moderna.', 'oHg5SJYRHA0', 'https://i3.ytimg.com/vi/oHg5SJYRHA0/maxresdefault.jpg', 300, playlist_id, item_type_id, 'Filosofía', 'youtube', 'es', NOW(), NOW());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "video_items" WHERE title = 'Economía Sagrada en Acción') THEN
        INSERT INTO "video_items" (title, description, content, "externalId", "thumbnailUrl", duration, "playlistId", "itemTypeId", categories, platform, language, "createdAt", "updatedAt") VALUES
        ('Economía Sagrada en Acción', 'Casos de estudio de cómo la economía sagrada está transformando comunidades.', 'Casos de estudio de cómo la economía sagrada está transformando comunidades.', 'U_3-zuoU_pA', 'https://i3.ytimg.com/vi/U_3-zuoU_pA/maxresdefault.jpg', 300, playlist_id, item_type_id, 'Economía', 'youtube', 'es', NOW(), NOW());
    END IF;
END $$;
