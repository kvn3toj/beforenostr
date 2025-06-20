-- 🎥 MIGRACIÓN DE PLAYLIST GAMIFICADAS® A BACKEND NESTJS (CORREGIDA)
-- Fecha: 2025-06-19T13:30:47.106Z
-- Fuente: Demo/apps/superapp-unified/Playlist Gamificadas®.html

-- 1. Limpiar videos de prueba existentes
DELETE FROM video_items WHERE platform = 'youtube' AND "externalId" IN (
  'dQw4w9WgXcQ', 'ScMzIvxBSi4', '9bZkp7q19f0', 'ZXsQAXx_ao0', 'kJQP7kiw5Fk', 'L_LUpnjgPso'
);

-- 2. Insertar videos reales de la playlist
INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'The Game Changers (Cambio Extremo)',
  'Video de tipo Documentales y Películas. Un documental revolucionario sobre nutrición vegetal.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/P7O-bHM8_KM" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=P7O-bHM8_KM',
  'youtube',
  'P7O-bHM8_KM',
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  1,
  true,
  5400,
  'https://img.youtube.com/vi/P7O-bHM8_KM/maxresdefault.jpg',
  'es',
  '["documentales","nutricion","salud","coomunity"]',
  '["Documentales","Salud","Nutrición"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  '¿What the bleep do we know? (¿Y tú qué #$%#& sabes?)',
  'Video de tipo Documentales y Películas. Categorías: Aprecio/Estima, Creatividad/Expresión, Discernimiento/Consciencia, Trascendencia/Paz Interior',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/h88cgeLfnss" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=h88cgeLfnss',
  'youtube',
  'h88cgeLfnss',
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  2,
  true,
  5400,
  'https://img.youtube.com/vi/h88cgeLfnss/maxresdefault.jpg',
  'es',
  '["documentales_y_películas","coomunity","gamificada"]',
  '["Documentales y Películas","Aprecio/Estima","Creatividad/Expresión","Discernimiento/Consciencia","Trascendencia/Paz Interior"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Happy',
  'Video de tipo Documentales y Películas. Categorías: Todas las categorías - Video holístico',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/OROOFtSm6hE" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=OROOFtSm6hE',
  'youtube',
  'OROOFtSm6hE',
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  3,
  true,
  5400,
  'https://img.youtube.com/vi/OROOFtSm6hE/maxresdefault.jpg',
  'es',
  '["documentales_y_películas","coomunity","gamificada"]',
  '["Documentales y Películas","Todas las categorías - Video holístico"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Thrive - ¿Cuánto le costará al planeta?',
  'Video de tipo Documentales y Películas. Categorías: Todas las categorías - Video sistémico',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/ftD7oGPMyhE" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=ftD7oGPMyhE',
  'youtube',
  'ftD7oGPMyhE',
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  4,
  true,
  5400,
  'https://img.youtube.com/vi/ftD7oGPMyhE/maxresdefault.jpg',
  'es',
  '["documentales_y_películas","coomunity","gamificada"]',
  '["Documentales y Películas","Todas las categorías - Video sistémico"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Cadena de Favores',
  'Video de tipo Documentales y Películas. Categorías: Aprecio/Estima, Cooperación/Relaciones, Lúdica/Alegría, Trascendencia/Paz Interior',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/zXGljphjCIk" frameborder="0" allowfullscreen></iframe>',
  'http://www.youtube.com/watch?v=zXGljphjCIk',
  'youtube',
  'zXGljphjCIk',
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  5,
  true,
  5400,
  'https://img.youtube.com/vi/zXGljphjCIk/maxresdefault.jpg',
  'es',
  '["documentales_y_películas","coomunity","gamificada"]',
  '["Documentales y Películas","Aprecio/Estima","Cooperación/Relaciones","Lúdica/Alegría","Trascendencia/Paz Interior"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Economía Sagrada',
  'Presentado por Charles Eisenstein. Un nuevo paradigma económico basado en la reciprocidad.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/EEZkQv25uEs" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=EEZkQv25uEs',
  'youtube',
  'EEZkQv25uEs',
  '55555555-5555-5555-5555-555555555555',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  2,
  true,
  1800,
  'https://img.youtube.com/vi/EEZkQv25uEs/maxresdefault.jpg',
  'es',
  '["economia","sagrada","charles_eisenstein","coomunity","ayni"]',
  '["Economía","Filosofía","CoomÜnity"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Los principios herméticos',
  'Presentado por Hermes Trismegisto. Los 7 principios universales de la filosofía hermética.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/lTo7yW7vjhw" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=lTo7yW7vjhw',
  'youtube',
  'lTo7yW7vjhw',
  '55555555-5555-5555-5555-555555555555',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  3,
  true,
  600,
  'https://img.youtube.com/vi/lTo7yW7vjhw/maxresdefault.jpg',
  'es',
  '["hermeticos","filosofia","trismegisto","coomunity"]',
  '["Filosofía","Espiritualidad","Hermetismo"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Gamificación, ¿se puede ser productivo jugando?',
  'Presentado por Magic Markers. Explorando el potencial de la gamificación para la productividad.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/ixBgrqho03E" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=ixBgrqho03E',
  'youtube',
  'ixBgrqho03E',
  '55555555-5555-5555-5555-555555555555',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  4,
  true,
  480,
  'https://img.youtube.com/vi/ixBgrqho03E/maxresdefault.jpg',
  'es',
  '["gamificacion","productividad","magic_markers","coomunity"]',
  '["Gamificación","Productividad","Educación"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'La Confianza es la Moneda de la Nueva Economía',
  'Presentado por Rachel Botsman. Cómo la confianza está transformando la economía colaborativa.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/kTqgiF4HmgQ" frameborder="0" allowfullscreen></iframe>',
  'https://youtu.be/kTqgiF4HmgQ',
  'youtube',
  'kTqgiF4HmgQ',
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  5,
  true,
  1200,
  'https://img.youtube.com/vi/kTqgiF4HmgQ/maxresdefault.jpg',
  'es',
  '["confianza","economia_colaborativa","rachel_botsman","coomunity"]',
  '["Economía","Confianza","Colaboración"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'En defensa del consumo colaborativo',
  'Presentado por Rachel Botsman. Subsistencia/Manutención, Cooperación/Relaciones, Creatividad/Expresión, Lúdica/Alegría',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/AQa3kUJPEko" frameborder="0" allowfullscreen></iframe>',
  'https://www.youtube.com/watch?v=AQa3kUJPEko',
  'youtube',
  'AQa3kUJPEko',
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  6,
  true,
  1200,
  'https://img.youtube.com/vi/AQa3kUJPEko/maxresdefault.jpg',
  'es',
  '["charlas_ted","rachel_botsman","coomunity","gamificada"]',
  '["Charlas Ted","Subsistencia/Manutención","Cooperación/Relaciones","Creatividad/Expresión","Lúdica/Alegría"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'La dignidad humana, fundamento de una nueva economía: Banca ética',
  'Presentado por Joan Antoni Melé. Todas las categorías - Economía ética',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/1G2knMO9P_w" frameborder="0" allowfullscreen></iframe>',
  'https://m.youtube.com/watch?v=1G2knMO9P_w',
  'youtube',
  '1G2knMO9P_w',
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  7,
  true,
  1200,
  'https://img.youtube.com/vi/1G2knMO9P_w/maxresdefault.jpg',
  'es',
  '["charlas_ted","joan_antoni_melé","coomunity","gamificada"]',
  '["Charlas Ted","Todas las categorías - Economía ética"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

INSERT INTO video_items (
  title, description, content, url, platform, "externalId",
  "playlistId", "itemTypeId", "order", "isActive", duration,
  "thumbnailUrl", language, tags, categories, quality,
  "createdAt", "updatedAt"
) VALUES (
  'Jugar puede crear un mejor mundo',
  'Presentado por Jane McGonigal. El poder transformador de los juegos para resolver problemas reales.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dE1DuBesGYM" frameborder="0" allowfullscreen></iframe>',
  'https://youtu.be/dE1DuBesGYM',
  'youtube',
  'dE1DuBesGYM',
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM item_types WHERE name = 'video' LIMIT 1),
  6,
  true,
  1200,
  'https://img.youtube.com/vi/dE1DuBesGYM/maxresdefault.jpg',
  'es',
  '["juegos","mundo_mejor","jane_mcgonigal","coomunity"]',
  '["Juegos","Transformación Social","TED"]',
  '{"hd":true,"subtitles":false}',
  NOW(),
  NOW()
);

-- 3. Actualizar títulos de playlists para reflejar el nuevo contenido
UPDATE playlists 
SET name = 'Documentales Conscientes',
    description = 'Documentales que promueven la consciencia y el bien común'
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE playlists 
SET name = 'Sabiduría Transformadora',
    description = 'Videos cortos con enseñanzas profundas para la transformación personal'
WHERE id = '55555555-5555-5555-5555-555555555555';

UPDATE playlists 
SET name = 'Charlas Inspiradoras',
    description = 'Charlas que inspiran y educan sobre colaboración y nueva economía'
WHERE id = '66666666-6666-6666-6666-666666666666';

UPDATE playlists 
SET name = 'LifeHacks y Sabiduría Práctica',
    description = 'Técnicas y hacks de vida para el desarrollo personal y bienestar integral'
WHERE id = '77777777-7777-7777-7777-777777777777';

-- 4. Insertar preguntas interactivas para videos clave
INSERT INTO questions ("videoItemId", timestamp, type, text, "languageCode", "isActive")
SELECT 
  v.id,
  30,
  'MULTIPLE_CHOICE',
  '¿Cuál es el principio fundamental de la Economía Sagrada según Charles Eisenstein?',
  'es',
  true
FROM video_items v 
WHERE v.title = 'Economía Sagrada' AND v.platform = 'youtube';

INSERT INTO questions ("videoItemId", timestamp, type, text, "languageCode", "isActive")
SELECT 
  v.id,
  60,
  'TRUE_FALSE',
  'La confianza puede medirse y cuantificarse como una moneda real.',
  'es',
  true
FROM video_items v 
WHERE v.title = 'La Confianza es la Moneda de la Nueva Economía' AND v.platform = 'youtube';

INSERT INTO questions ("videoItemId", timestamp, type, text, "languageCode", "isActive")
SELECT 
  v.id,
  45,
  'MULTIPLE_CHOICE',
  '¿Cuál es la clave del éxito en la gamificación según este video?',
  'es',
  true
FROM video_items v 
WHERE v.title LIKE '%Gamificación%' AND v.platform = 'youtube';

-- ✅ MIGRACIÓN COMPLETADA
-- Total de videos migrados: 12
-- Videos organizados por tipo de contenido en playlists dedicadas
-- Preguntas interactivas agregadas para engagement
-- Videos alineados con la filosofía CoomÜnity 