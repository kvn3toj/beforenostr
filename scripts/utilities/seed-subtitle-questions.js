const { execSync } = require('child_process');

async function seedData() {
  try {
    console.log('🌱 Ejecutando seeder para subtítulos y preguntas...\n');
    
    // Verificar si ya hay un seeder en la base de datos
    const result = execSync('npm run seed', { 
      encoding: 'utf8',
      timeout: 30000
    });
    
    console.log('✅ Seeder ejecutado exitosamente:');
    console.log(result);
    
  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error.message);
    
    // Si no hay un script de seed, crear datos mínimos
    console.log('🔄 Creando datos de prueba básicos...');
    
    try {
      // Usar Prisma CLI para crear datos básicos
      const createData = `
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
      `;
      
      require('fs').writeFileSync('temp-seed.sql', createData);
      
      execSync('npx prisma db execute --file temp-seed.sql --schema prisma/schema.prisma', {
        encoding: 'utf8'
      });
      
      console.log('✅ Datos de prueba creados exitosamente');
      
      // Limpiar archivo temporal
      require('fs').unlinkSync('temp-seed.sql');
      
    } catch (sqlError) {
      console.error('❌ Error creando datos de prueba:', sqlError.message);
    }
  }
}

seedData(); 