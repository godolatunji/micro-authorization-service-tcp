import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RoleModule } from '../role/role.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [DatabaseModule, RoleModule],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
