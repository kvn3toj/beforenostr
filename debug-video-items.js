const { PrismaClient } = require('./src/generated/prisma');

async function debugVideoItems() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Debugging video_items table...\n');
    
    // Check if video_items table exists and get count
    const count = await prisma.videoItem.count();
    console.log(`📊 Total video items: ${count}`);
    
    // Get first few video items
    const videoItems = await prisma.videoItem.findMany({
      take: 5,
      include: {
        playlist: true,
        questions: true
      }
    });
    
    console.log('\n📋 First 5 video items:');
    videoItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ID: ${item.id}`);
      console.log(`   Title: ${item.title}`);
      console.log(`   Platform: ${item.platform}`);
      console.log(`   External ID: ${item.externalId}`);
      console.log(`   Duration: ${item.duration}`);
      console.log(`   Content: ${item.content?.substring(0, 100)}...`);
      console.log(`   Item Type ID: ${item.itemTypeId}`);
    });
    
    // Try to get video item with ID 1 specifically
    console.log('\n🎯 Testing video item ID 1:');
    try {
      const videoItem1 = await prisma.videoItem.findFirst({
        where: { id: 1 },
        include: {
          playlist: true,
          questions: true
        }
      });
      
      if (videoItem1) {
        console.log('✅ Video item 1 found:');
        console.log(`   Title: ${videoItem1.title}`);
        console.log(`   Platform: ${videoItem1.platform}`);
        console.log(`   External ID: ${videoItem1.externalId}`);
        console.log(`   Content: ${videoItem1.content}`);
        console.log(`   Item Type ID: ${videoItem1.itemTypeId}`);
      } else {
        console.log('❌ Video item 1 not found');
      }
    } catch (error) {
      console.error('❌ Error fetching video item 1:', error.message);
    }
    
    // Check item_types table
    console.log('\n📋 Checking item_types table:');
    try {
      const itemTypes = await prisma.itemType.findMany();
      console.log(`📊 Total item types: ${itemTypes.length}`);
      itemTypes.forEach(type => {
        console.log(`   - ${type.id}: ${type.name}`);
      });
    } catch (error) {
      console.error('❌ Error fetching item types:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugVideoItems().catch(console.error); 