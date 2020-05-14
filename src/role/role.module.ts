import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { microservices } from '../microservices.import';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [...microservices, DatabaseModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
