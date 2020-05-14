import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [DatabaseModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
