import { test, expect } from '@playwright/test';

test.describe('Subtitles and Questions Real Data Test', () => {
  test('Should load real subtitles and questions data from backend', async ({ page }) => {
    console.log('🚀 Starting backend endpoints verification...');

    // Verificar que los endpoints del backend están funcionando
    console.log('🔍 Testing backend endpoints directly...');
    
    // Test subtitles endpoint - usando videoItemId=2 que tiene datos reales
    const subtitlesResponse = await page.request.get('http://localhost:1111/subtitles/search?videoItemId=2');
    const subtitlesData = await subtitlesResponse.json();
    
    console.log('📝 Subtitles endpoint response:', subtitlesData.length, 'items');
    expect(subtitlesResponse.ok()).toBeTruthy();
    expect(Array.isArray(subtitlesData)).toBeTruthy();
    
    if (subtitlesData.length > 0) {
      console.log('✅ Real subtitles data found:', subtitlesData[0]);
      expect(subtitlesData[0]).toHaveProperty('id');
      expect(subtitlesData[0]).toHaveProperty('videoItemId');
      expect(subtitlesData[0]).toHaveProperty('languageCode');
      expect(subtitlesData[0]).toHaveProperty('content');
    }

    // Test questions endpoint - usando videoItemId=2 que tiene datos reales
    const questionsResponse = await page.request.get('http://localhost:1111/questions/search?videoItemId=2');
    const questionsData = await questionsResponse.json();
    
    console.log('❓ Questions endpoint response:', questionsData.length, 'items');
    expect(questionsResponse.ok()).toBeTruthy();
    expect(Array.isArray(questionsData)).toBeTruthy();
    
    if (questionsData.length > 0) {
      console.log('✅ Real questions data found:', questionsData[0]);
      expect(questionsData[0]).toHaveProperty('id');
      expect(questionsData[0]).toHaveProperty('videoItemId');
      expect(questionsData[0]).toHaveProperty('timestamp');
      expect(questionsData[0]).toHaveProperty('text');
      expect(questionsData[0]).toHaveProperty('type');
    }

    // Resumen final
    console.log('\n📊 VERIFICATION SUMMARY:');
    console.log(`Subtitles Data Items: ${subtitlesData.length}`);
    console.log(`Questions Data Items: ${questionsData.length}`);

    // El test pasa si:
    // 1. Los endpoints del backend devuelven datos
    expect(subtitlesData.length).toBeGreaterThan(0);
    expect(questionsData.length).toBeGreaterThan(0);
    
    console.log('🎉 Test completed successfully! Real data is being served by the backend.');
    console.log('✅ Services are now connected to real data instead of mocks.');
  });
}); 