import { PrismaClient } from '../src/generated/prisma/index';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

const prisma = new PrismaClient();

interface VideoData {
  type: string;
  title: string;
  trailerUrl?: string;
  completeUrl?: string;
  categories: {
    subsistencia: boolean;
    seguridad: boolean;
    aprecio: boolean;
    cooperacion: boolean;
    creatividad: boolean;
    ludica: boolean;
    discernimiento: boolean;
    trascendencia: boolean;
  };
  merits: number;
}

// Map category columns to category names
const categoryMap = {
  4: 'subsistencia',
  5: 'seguridad',
  6: 'aprecio',
  7: 'cooperacion',
  8: 'creatividad',
  9: 'ludica',
  10: 'discernimiento',
  11: 'trascendencia',
};

// Map video types to item types
const videoTypeMap: Record<string, string> = {
  'Documentales y Películas': 'documentary',
  'Clips cortos': 'short_clip',
  LifeHacks: 'lifehack',
  'Charlas Ted': 'ted_talk',
};

async function parseHTMLFile(): Promise<VideoData[]> {
  const htmlPath = path.join(
    __dirname,
    '../../Demo/apps/superapp-unified/Playlist Gamificadas®.html'
  );
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const rows = document.querySelectorAll('tbody tr');

  const videos: VideoData[] = [];

  // Skip header rows (0-4) and start from row 5
  for (let i = 5; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');

    if (cells.length < 13) continue;

    const typeCell = cells[0];
    const titleCell = cells[1];
    const trailerCell = cells[2];
    const completeCell = cells[3];
    const meritCell = cells[12];

    // Skip empty rows
    if (!typeCell.textContent?.trim() || !titleCell.textContent?.trim())
      continue;

    const video: VideoData = {
      type: typeCell.textContent.trim(),
      title: titleCell.textContent.trim(),
      categories: {
        subsistencia: false,
        seguridad: false,
        aprecio: false,
        cooperacion: false,
        creatividad: false,
        ludica: false,
        discernimiento: false,
        trascendencia: false,
      },
      merits: parseInt(meritCell.textContent?.trim() || '0') || 0,
    };

    // Extract URLs from anchor tags
    const trailerAnchor = trailerCell.querySelector('a');
    const completeAnchor = completeCell.querySelector('a');

    if (trailerAnchor) {
      video.trailerUrl = trailerAnchor.getAttribute('href') || undefined;
    }

    if (completeAnchor) {
      video.completeUrl = completeAnchor.getAttribute('href') || undefined;
    }

    // Parse categories (columns 4-11)
    for (let col = 4; col <= 11; col++) {
      const categoryCell = cells[col];
      if (categoryCell.textContent?.trim().toLowerCase() === 'x') {
        const categoryName = categoryMap[col as keyof typeof categoryMap];
        if (categoryName) {
          video.categories[categoryName as keyof typeof video.categories] =
            true;
        }
      }
    }

    videos.push(video);
  }

  return videos;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function seedUplayVideos() {
  console.log('🎬 Starting UPLAY video seeding...');

  try {
    // First, ensure we have a UPLAY mundo
    let uplayMundo = await prisma.mundo.findFirst({
      where: { name: 'UPLAY' },
    });

    if (!uplayMundo) {
      console.log('Creating UPLAY mundo...');
      uplayMundo = await prisma.mundo.create({
        data: {
          name: 'UPLAY',
          description: 'Universo de contenido multimedia gamificado',
          imageUrl: '/images/mundos/uplay.jpg',
          isActive: true,
        },
      });
    }

    // Create playlists for each video type
    const playlistMap = new Map<string, string>();

    for (const [typeName, typeKey] of Object.entries(videoTypeMap)) {
      let playlist = await prisma.playlist.findFirst({
        where: {
          mundoId: uplayMundo.id,
          name: typeName,
        },
      });

      if (!playlist) {
        console.log(`Creating playlist: ${typeName}`);
        playlist = await prisma.playlist.create({
          data: {
            mundoId: uplayMundo.id,
            name: typeName,
            description: `Colección de ${typeName.toLowerCase()}`,
            isActive: true,
            orderInMundo: Object.keys(videoTypeMap).indexOf(typeName),
          },
        });
      }

      playlistMap.set(typeName, playlist.id);
    }

    // Parse videos from HTML
    const videos = await parseHTMLFile();
    console.log(`Found ${videos.length} videos to import`);

    // Create video items
    let successCount = 0;
    let skipCount = 0;

    for (const video of videos) {
      const playlistId = playlistMap.get(video.type);
      if (!playlistId) {
        console.warn(`Unknown video type: ${video.type}`);
        skipCount++;
        continue;
      }

      // Use complete URL if available, otherwise use trailer URL
      const primaryUrl = video.completeUrl || video.trailerUrl;
      if (!primaryUrl) {
        console.warn(`No URL found for video: ${video.title}`);
        skipCount++;
        continue;
      }

      const youtubeId = extractYouTubeId(primaryUrl);

      // Check if video already exists
      const existingVideo = await prisma.videoItem.findFirst({
        where: {
          OR: [{ title: video.title }, { externalId: youtubeId || undefined }],
        },
      });

      if (existingVideo) {
        console.log(`Video already exists: ${video.title}`);
        skipCount++;
        continue;
      }

      // Build categories array
      const categories = Object.entries(video.categories)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

      // Create video item
      await prisma.videoItem.create({
        data: {
          title: video.title,
          description: `${video.type} - ${categories.join(', ')}`,
          content: JSON.stringify({
            trailerUrl: video.trailerUrl,
            completeUrl: video.completeUrl,
            merits: video.merits,
            categories: video.categories,
          }),
          url: primaryUrl,
          platform: 'youtube',
          externalId: youtubeId,
          playlistId,
          itemTypeId: videoTypeMap[video.type] || 'video',
          order: successCount,
          isActive: true,
          categories: categories.join(','),
          thumbnailUrl: youtubeId
            ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
            : undefined,
          tags: JSON.stringify({
            type: video.type,
            merits: video.merits,
            ...video.categories,
          }),
        },
      });

      console.log(`✅ Created video: ${video.title}`);
      successCount++;
    }

    console.log(`\n🎉 UPLAY video seeding completed!`);
    console.log(`   - Videos created: ${successCount}`);
    console.log(`   - Videos skipped: ${skipCount}`);
    console.log(`   - Total videos: ${videos.length}`);
  } catch (error) {
    console.error('Error seeding UPLAY videos:', error);
    throw error;
  }
}

async function main() {
  await seedUplayVideos();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
