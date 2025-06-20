
        CREATE TABLE IF NOT EXISTS temp_data AS 
        SELECT 1 as id, 'Test Video' as title;
        
        INSERT OR IGNORE INTO ContentItem (id, title, description, type, url, thumbnailUrl, createdAt, updatedAt)
        VALUES (1, 'Test Video', 'Video de prueba', 'VIDEO', 'https://example.com/video1.mp4', 'https://example.com/thumb1.jpg', datetime('now'), datetime('now'));
        
        INSERT OR IGNORE INTO Subtitle (videoItemId, languageCode, format, content, createdAt, updatedAt)
        VALUES 
          (1, 'es', 'SRT', 'Este es un subtítulo de prueba en español', datetime('now'), datetime('now')),
          (1, 'en', 'SRT', 'This is a test subtitle in English', datetime('now'), datetime('now'));
        
        INSERT OR IGNORE INTO Question (videoItemId, questionText, type, languageCode, timeCode, createdAt, updatedAt)
        VALUES 
          (1, '¿Cuál es el tema principal del video?', 'BINARY', 'es', 60, datetime('now'), datetime('now')),
          (1, 'What is the main topic of the video?', 'BINARY', 'en', 60, datetime('now'), datetime('now'));
      