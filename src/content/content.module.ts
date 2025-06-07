import { Module } from '@nestjs/common';
import { MundosModule } from './mundos/mundos.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { ItemTypesModule } from './item-types/item-types.module';
// import { ItemsModule } from './items/items.module'; // COMENTADO TEMPORALMENTE - CARPETA MOVIDA
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [MundosModule, PlaylistsModule, ItemTypesModule, /* ItemsModule, */ AuthModule, RbacModule],
  controllers: [],
  providers: [],
  exports: [MundosModule, PlaylistsModule, ItemTypesModule, /* ItemsModule */], // Export sub-modules if their services are needed elsewhere
})
export class ContentModule {} 