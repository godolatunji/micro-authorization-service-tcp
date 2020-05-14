/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleDto } from './role.dto';
import { Role } from './role.model';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  login({ headers, data }): Promise<any> {
    return this.roleService.login(headers, data);
  }

  @MessagePattern({ cmd: 'listRoles' })
  list({ headers }): Promise<Role[]> {
    return this.roleService.list();
  }

  @MessagePattern({ cmd: 'createRole' })
  create({ headers, data }): Promise<Role> {
    return this.roleService.create(data);
  }

  @MessagePattern({ cmd: 'updateRole' })
  update({ headers, data }): Promise<Role> {
    return this.roleService.create(data);
  }

  @MessagePattern({ cmd: 'deleteRole' })
  delete({ headers, data }): Promise<boolean> {
    return this.roleService.delete(data.id);
  }

  @MessagePattern({ cmd: 'updatePermissions' })
  updatePermissions({ headers, data }): Promise<Role> {
    return this.roleService.updatePermissions(data);
  }

  @MessagePattern({ cmd: 'addPermissionToRole' })
  addPermissionToRole({ headers, data }): Promise<Role> {
    return this.roleService.addPermissionToRole(data.roleId, data.permissionId);
  }
}
