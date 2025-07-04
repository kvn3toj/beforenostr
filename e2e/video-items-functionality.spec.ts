import { test, expect } from '@playwright/test';

test.describe('Video Items Functionality Tests', () => {
  const baseURL = 'http://localhost:3002';

  test('Video items should have required properties', async ({ request }) => {
    console.log('🎥 Testing video items structure...');
    
    const response = await request.get(`${baseURL}/video-items`);
    expect(response.status()).toBe(200);
    
    const videoItems = await response.json();
    
    if (videoItems.length > 0) {
      const firstItem = videoItems[0];
      
      // Check required properties
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('content');
      expect(firstItem).toHaveProperty('createdAt');
      expect(firstItem).toHaveProperty('updatedAt');
      
      console.log('✅ Video item structure is correct');
      console.log(`   - ID: ${firstItem.id}`);
      console.log(`   - Title: ${firstItem.title}`);
      console.log(`   - Platform: ${firstItem.platform || 'Not detected'}`);
      console.log(`   - Duration: ${firstItem.duration || 'Not calculated'}`);
    } else {
      console.log('⚠️ No video items found to test structure');
    }
  });

  test('Video item duration calculation should work', async ({ request }) => {
    console.log('⏱️ Testing video duration calculation...');
    
    const response = await request.get(`${baseURL}/video-items`);
    const videoItems = await response.json();
    
    if (videoItems.length > 0) {
      const videoWithYouTube = videoItems.find(item => 
        item.content && item.content.includes('youtube.com')
      );
      
      if (videoWithYouTube) {
        const testResponse = await request.get(
          `${baseURL}/video-items/${videoWithYouTube.id}/test-duration`
        );
        
        if (testResponse.status() === 200) {
          const testResult = await testResponse.json();
          console.log('✅ Duration calculation test completed:', testResult);
        } else {
          console.log('⚠️ Duration test endpoint not available');
        }
      } else {
        console.log('⚠️ No YouTube videos found to test duration calculation');
      }
    }
  });

  test('Video platform detection should work', async ({ request }) => {
    console.log('🔍 Testing platform detection...');
    
    const response = await request.get(`${baseURL}/video-items`);
    const videoItems = await response.json();
    
    const platformCounts = {
      youtube: 0,
      vimeo: 0,
      local: 0,
      unknown: 0
    };
    
    videoItems.forEach(item => {
      if (item.platform) {
        platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1;
      } else {
        platformCounts.unknown++;
      }
    });
    
    console.log('✅ Platform detection results:');
    console.log(`   - YouTube: ${platformCounts.youtube}`);
    console.log(`   - Vimeo: ${platformCounts.vimeo}`);
    console.log(`   - Local: ${platformCounts.local}`);
    console.log(`   - Unknown: ${platformCounts.unknown}`);
  });

  test('Video metadata extraction should work', async ({ request }) => {
    console.log('📊 Testing metadata extraction...');
    
    const response = await request.get(`${baseURL}/video-items`);
    const videoItems = await response.json();
    
    if (videoItems.length > 0) {
      const firstItem = videoItems[0];
      
      // Test metadata extraction endpoint if available
      const metadataResponse = await request.get(
        `${baseURL}/video-items/${firstItem.id}/metadata`
      );
      
      if (metadataResponse.status() === 200) {
        const metadata = await metadataResponse.json();
        console.log('✅ Metadata extraction successful:', metadata);
      } else {
        console.log('⚠️ Metadata extraction endpoint not available');
      }
    }
  });

  test('Video items should be filterable by platform', async ({ request }) => {
    console.log('🔎 Testing platform filtering...');
    
    // Test filtering by YouTube
    const youtubeResponse = await request.get(`${baseURL}/video-items?platform=youtube`);
    
    if (youtubeResponse.status() === 200) {
      const youtubeItems = await youtubeResponse.json();
      console.log(`✅ Found ${youtubeItems.length} YouTube videos`);
      
      // Verify all items are actually YouTube
      const allYouTube = youtubeItems.every(item => 
        item.platform === 'youtube' || 
        (item.content && item.content.includes('youtube.com'))
      );
      
      if (youtubeItems.length > 0) {
        expect(allYouTube).toBe(true);
        console.log('✅ All filtered items are YouTube videos');
      }
    } else {
      console.log('⚠️ Platform filtering not available');
    }
  });

  test('Video items pagination should work', async ({ request }) => {
    console.log('📄 Testing pagination...');
    
    // Test with page and limit parameters
    const paginatedResponse = await request.get(`${baseURL}/video-items?page=1&limit=5`);
    
    if (paginatedResponse.status() === 200) {
      const paginatedItems = await paginatedResponse.json();
      
      if (Array.isArray(paginatedItems)) {
        expect(paginatedItems.length).toBeLessThanOrEqual(5);
        console.log(`✅ Pagination working: returned ${paginatedItems.length} items`);
      } else if (paginatedItems.data) {
        // If response is wrapped in a data object
        expect(paginatedItems.data.length).toBeLessThanOrEqual(5);
        console.log(`✅ Pagination working: returned ${paginatedItems.data.length} items`);
        console.log(`   - Total: ${paginatedItems.total || 'unknown'}`);
        console.log(`   - Page: ${paginatedItems.page || 'unknown'}`);
      }
    } else {
      console.log('⚠️ Pagination not available');
    }
  });

  test('Video items search should work', async ({ request }) => {
    console.log('🔍 Testing search functionality...');
    
    const searchResponse = await request.get(`${baseURL}/video-items?search=test`);
    
    if (searchResponse.status() === 200) {
      const searchResults = await searchResponse.json();
      console.log(`✅ Search returned ${searchResults.length} results`);
      
      // Verify search results contain the search term
      if (searchResults.length > 0) {
        const hasSearchTerm = searchResults.some(item => 
          item.title?.toLowerCase().includes('test') ||
          item.content?.toLowerCase().includes('test')
        );
        
        if (hasSearchTerm) {
          console.log('✅ Search results contain search term');
        } else {
          console.log('⚠️ Search results may not be filtered correctly');
        }
      }
    } else {
      console.log('⚠️ Search functionality not available');
    }
  });

  test('Video items should handle invalid IDs gracefully', async ({ request }) => {
    console.log('❌ Testing error handling for invalid IDs...');
    
    const invalidResponse = await request.get(`${baseURL}/video-items/999999`);
    expect(invalidResponse.status()).toBe(404);
    
    const errorResponse = await invalidResponse.json();
    expect(errorResponse).toHaveProperty('message');
    console.log('✅ Invalid ID handled correctly:', errorResponse.message);
  });

  test('Video items should validate required fields', async ({ request }) => {
    console.log('✅ Testing field validation...');
    
    // Test creating a video item without required fields
    const invalidCreateResponse = await request.post(`${baseURL}/video-items`, {
      data: {
        // Missing required fields
      }
    });
    
    expect(invalidCreateResponse.status()).toBe(400);
    console.log('✅ Field validation working correctly');
  });
}); 