import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function verifyUplayVideos() {
  try {
    console.log('🔍 Verifying UPLAY videos in database...\n');

    // Get UPLAY mundo
    const uplayMundo = await prisma.mundo.findFirst({
      where: { nombre: 'UPlay' },
    });

    if (!uplayMundo) {
      console.log('❌ UPLAY mundo not found!');
      return;
    }

    console.log('✅ UPLAY mundo found:', uplayMundo.nombre);

    // Get all playlists
    const playlists = await prisma.playlist.findMany({
      where: { mundoId: uplayMundo.id },
      include: {
        _count: {
          select: { videoItems: true },
        },
      },
    });

    console.log('\n📋 Playlists:');
    for (const playlist of playlists) {
      console.log(
        `  - ${playlist.nombre}: ${playlist._count.videoItems} videos`
      );
    }

    // Get total video count
    const totalVideos = await prisma.videoItem.count({
      where: {
        playlist: {
          mundoId: uplayMundo.id,
        },
      },
    });

    console.log(`\n📊 Total videos: ${totalVideos}`);

    // Get videos by category
    const videosByCategory = await prisma.videoItem.groupBy({
      by: ['categoria'],
      where: {
        playlist: {
          mundoId: uplayMundo.id,
        },
      },
      _count: {
        _all: true,
      },
    });

    console.log('\n🏷️  Videos by category:');
    for (const cat of videosByCategory) {
      console.log(`  - ${cat.categoria}: ${cat._count._all} videos`);
    }

    // Sample some videos
    const sampleVideos = await prisma.videoItem.findMany({
      where: {
        playlist: {
          mundoId: uplayMundo.id,
        },
      },
      take: 5,
      include: {
        playlist: true,
      },
    });

    console.log('\n📹 Sample videos:');
    for (const video of sampleVideos) {
      console.log(
        `  - "${video.titulo}" (${video.playlist.nombre}) - ${video.meritos} merits`
      );
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUplayVideos();
