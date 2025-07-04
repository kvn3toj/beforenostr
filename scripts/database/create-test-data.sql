-- Primero crear un Mundo de prueba
INSERT INTO mundos (id, name, description, imageUrl, isActive, createdAt, updatedAt)
VALUES ('mundo-test-001', 'Mundo de Prueba', 'Este es un mundo de prueba para subtítulos y preguntas', 'https://example.com/mundo-thumbnail.jpg', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00');

-- Crear una Playlist de prueba
INSERT INTO playlists (id, mundoId, name, description, imageUrl, orderInMundo, isActive, createdAt, updatedAt)
VALUES ('playlist-test-001', 'mundo-test-001', 'Playlist de Prueba', 'Esta es una playlist de prueba', 'https://example.com/playlist-thumbnail.jpg', 1, true, '2025-05-29 00:00:00', '2025-05-29 00:00:00');

-- Insertar un VideoItem de prueba
INSERT INTO video_items (id, title, description, content, playlistId, itemTypeId, "order", isActive, createdAt, updatedAt)
VALUES (1, 'Video de Prueba', 'Este es un video de prueba para subtítulos y preguntas', 'Contenido del video de prueba', 'playlist-test-001', 'video-type-001', 1, true, '2025-05-29 00:00:00', '2025-05-29 00:00:00');

-- Insertar subtítulos de prueba
INSERT INTO subtitles (id, videoItemId, languageCode, format, content, isActive, createdAt, updatedAt)
VALUES 
(1, 1, 'es', 'srt', '1\n00:00:01,000 --> 00:00:05,000\nEste es el primer subtítulo en español\n\n2\n00:00:06,000 --> 00:00:10,000\nEste es el segundo subtítulo en español', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00'),
(2, 1, 'en', 'srt', '1\n00:00:01,000 --> 00:00:05,000\nThis is the first subtitle in English\n\n2\n00:00:06,000 --> 00:00:10,000\nThis is the second subtitle in English', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00');

-- Insertar preguntas de prueba
INSERT INTO questions (id, videoItemId, timestamp, type, text, languageCode, isActive, createdAt, updatedAt)
VALUES 
(1, 1, 30, 'BINARY', '¿Cuál es el tema principal de este video?', 'es', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00'),
(2, 1, 30, 'BINARY', 'What is the main topic of this video?', 'en', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00'),
(3, 1, 60, 'BINARY', '¿Te gustó el contenido del video?', 'es', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00'); 