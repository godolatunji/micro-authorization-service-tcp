import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePermissionDto } from './create-permission.dto';
import { Permission } from './permission.model';
import { PermissionService } from './permission.service';

@Controller()
export class PermissionController {
  constructor(
    @Inject(PermissionService)
    private readonly permissionService: PermissionService,
  ) {}

  @MessagePattern({ cmd: 'listPermissions' })
  list({ headers }): Promise<Permission[]> {
    return this.permissionService.list();
  }

  @MessagePattern({ cmd: 'createPermission' })
  create({ headers, data }): Promise<Permission> {
    return this.permissionService.create(data);
  }

  @MessagePattern({ cmd: 'updatePermission' })
  update({ headers, data }): Promise<Permission> {
    return this.permissionService.create(data);
  }

  @MessagePattern({ cmd: 'deletePermission' })
  delete({ headers, data }): Promise<boolean> {
    return this.permissionService.delete(data.id);
  }
}
