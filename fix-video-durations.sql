-- Script para corregir las duraciones inconsistentes de videos TED
-- Basado en el análisis que identificó 8 videos con duraciones incorrectas

-- Video 29: Las primeras 20 horas - Cómo aprender cualquier cosa
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 10 minutos (600s)
UPDATE video_items SET duration = 1080 WHERE id = 29;

-- Video 31: En defensa del consumo colaborativo  
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 8 minutos (480s)
UPDATE video_items SET duration = 1080 WHERE id = 31;

-- Video 32: Cómo construir una economía basada en el lugar que vives
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 10 minutos (600s)
UPDATE video_items SET duration = 1080 WHERE id = 32;

-- Video 34: Jugar puede crear un mejor mundo
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 8 minutos (480s)
UPDATE video_items SET duration = 1080 WHERE id = 34;

-- Video 35: ¿Eres un dador o quitador?
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 8 minutos (480s)
UPDATE video_items SET duration = 1080 WHERE id = 35;

-- Video 36: ¿Quién eres, realmente? El rompecabezas de la personalidad
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 8 minutos (480s)
UPDATE video_items SET duration = 1080 WHERE id = 36;

-- Video 37: ¿Por qué todos necesitamos practicar primeros auxilios emocionales?
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 8 minutos (480s)
UPDATE video_items SET duration = 1080 WHERE id = 37;

-- Video 38: La prisión de la mente
-- Duración real estimada: 18 minutos (1080s) vs almacenada: 8 minutos (480s)
UPDATE video_items SET duration = 1080 WHERE id = 38;

-- Verificar las actualizaciones
SELECT id, title, duration, 
       printf('%d:%02d', duration / 60, duration % 60) as formatted_duration
FROM video_items 
WHERE id IN (29, 31, 32, 34, 35, 36, 37, 38)
ORDER BY id; 