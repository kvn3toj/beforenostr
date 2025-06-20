import { test, expect } from '@playwright/test';

/**
 * Pruebas para las APIs mockeadas del servidor CoomÜnity
 */

test.describe('APIs Mockeadas', () => {
  
  test('Health check API should respond correctly', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('server', 'CoomÜnity Local Mock Server');
    expect(data).toHaveProperty('sections');
    expect(data.sections).toContain('pilgrim');
    expect(data.sections).toContain('merchant');
    expect(data.sections).toContain('red-pill');
    expect(data).toHaveProperty('timestamp');
  });

  test.describe('Pilgrim APIs', () => {
    test('Should get pilgrim profile', async ({ request }) => {
      const response = await request.get('/api/pilgrim/profile');
      
      expect(response.status()).toBe(200);
      
      const profile = await response.json();
      expect(profile).toHaveProperty('id', 'pilgrim_001');
      expect(profile).toHaveProperty('name', 'Alex Pilgrim');
      expect(profile).toHaveProperty('level', 5);
      expect(profile).toHaveProperty('experience', 1250);
      expect(profile).toHaveProperty('journey');
      expect(profile.journey).toHaveProperty('currentStage', 'exploration');
      expect(profile).toHaveProperty('stats');
      expect(profile.stats).toHaveProperty('wisdom', 85);
    });

    test('Should get pilgrim quests', async ({ request }) => {
      const response = await request.get('/api/pilgrim/quests');
      
      expect(response.status()).toBe(200);
      
      const quests = await response.json();
      expect(Array.isArray(quests)).toBe(true);
      expect(quests.length).toBeGreaterThan(0);
      
      const firstQuest = quests[0];
      expect(firstQuest).toHaveProperty('id');
      expect(firstQuest).toHaveProperty('title');
      expect(firstQuest).toHaveProperty('description');
      expect(firstQuest).toHaveProperty('difficulty');
      expect(firstQuest).toHaveProperty('reward');
      expect(firstQuest).toHaveProperty('status');
    });
  });

  test.describe('Merchant APIs', () => {
    test('Should get merchant profile', async ({ request }) => {
      const response = await request.get('/api/merchant/profile');
      
      expect(response.status()).toBe(200);
      
      const profile = await response.json();
      expect(profile).toHaveProperty('id', 'merchant_001');
      expect(profile).toHaveProperty('businessName', 'Conscious Commerce Co.');
      expect(profile).toHaveProperty('owner', 'Maria Merchant');
      expect(profile).toHaveProperty('rating', 4.8);
      expect(profile).toHaveProperty('sales');
      expect(profile.sales).toHaveProperty('thisMonth');
      expect(profile.sales).toHaveProperty('growth');
      expect(profile).toHaveProperty('orders');
    });

    test('Should get merchant matches', async ({ request }) => {
      const response = await request.get('/api/merchant/matches');
      
      expect(response.status()).toBe(200);
      
      const matches = await response.json();
      expect(Array.isArray(matches)).toBe(true);
      expect(matches.length).toBeGreaterThan(0);
      
      const firstMatch = matches[0];
      expect(firstMatch).toHaveProperty('id');
      expect(firstMatch).toHaveProperty('type');
      expect(firstMatch).toHaveProperty('name');
      expect(firstMatch).toHaveProperty('compatibility');
      expect(firstMatch).toHaveProperty('status');
    });

    test('Should get merchant products', async ({ request }) => {
      const response = await request.get('/api/merchant/products');
      
      expect(response.status()).toBe(200);
      
      const products = await response.json();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      
      const firstProduct = products[0];
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('stock');
      expect(firstProduct).toHaveProperty('rating');
    });
  });

  test.describe('Red Pill APIs', () => {
    test('Should get journey state', async ({ request }) => {
      const response = await request.get('/api/red-pill/journey');
      
      expect(response.status()).toBe(200);
      
      const journey = await response.json();
      expect(journey).toHaveProperty('sessionId');
      expect(journey).toHaveProperty('currentStep', 'initial');
      expect(journey).toHaveProperty('progress', 0);
      expect(journey).toHaveProperty('choices');
      expect(journey).toHaveProperty('insights');
      expect(journey).toHaveProperty('paths');
      expect(journey.paths).toHaveProperty('available');
      expect(journey.paths.available).toContain('left');
      expect(journey.paths.available).toContain('right');
    });

    test('Should record journey choice', async ({ request }) => {
      // Primero obtener un sessionId
      const journeyResponse = await request.get('/api/red-pill/journey');
      const journeyData = await journeyResponse.json();
      const sessionId = journeyData.sessionId;

      // Luego registrar una elección
      const choiceResponse = await request.post(`/api/red-pill/journey/${sessionId}/choice`, {
        data: {
          path: 'left',
          step: 1,
          timestamp: new Date().toISOString()
        }
      });
      
      expect(choiceResponse.status()).toBe(200);
      
      const choiceResult = await choiceResponse.json();
      expect(choiceResult).toHaveProperty('sessionId', sessionId);
      expect(choiceResult).toHaveProperty('choiceRecorded');
      expect(choiceResult).toHaveProperty('nextStep', 'left_path');
      expect(choiceResult).toHaveProperty('insight');
      expect(choiceResult).toHaveProperty('progress');
    });

    test('Should get available videos', async ({ request }) => {
      const response = await request.get('/api/red-pill/videos');
      
      expect(response.status()).toBe(200);
      
      const videos = await response.json();
      expect(Array.isArray(videos)).toBe(true);
      expect(videos.length).toBeGreaterThan(0);
      
      const firstVideo = videos[0];
      expect(firstVideo).toHaveProperty('id');
      expect(firstVideo).toHaveProperty('title');
      expect(firstVideo).toHaveProperty('url');
      expect(firstVideo).toHaveProperty('duration');
      expect(firstVideo).toHaveProperty('triggers');
    });
  });

  test('Should handle 404 for unknown API endpoints', async ({ request }) => {
    const response = await request.get('/api/unknown/endpoint');
    
    expect(response.status()).toBe(404);
    
    const error = await response.json();
    expect(error).toHaveProperty('error', 'API endpoint not found');
    expect(error).toHaveProperty('endpoint', '/api/unknown/endpoint');
    expect(error).toHaveProperty('availableEndpoints');
    expect(error).toHaveProperty('suggestion');
  });
}); 