import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PermissionModule } from './permission/permission.module';
import { ResourceModule } from './resource/resource.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [DatabaseModule, ResourceModule, RoleModule, PermissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
