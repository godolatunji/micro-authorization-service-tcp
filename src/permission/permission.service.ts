import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Resource } from '../resource/resource.model';
import { RoleService } from '../role/role.service';
import { CreatePermissionDto } from './create-permission.dto';
import { Permission } from './permission.model';

@Injectable()
export class PermissionService {
  private readonly permissionRepositoy: Repository<Permission>;
  private readonly resourceRepositoy: Repository<Resource>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @Inject(RoleService) private readonly roleService: RoleService,
  ) {
    this.permissionRepositoy = entityManager.getRepository(Permission);
    this.resourceRepositoy = entityManager.getRepository(Resource);
  }

  async create(data: CreatePermissionDto): Promise<Permission> {
    const resource = await this.resourceRepositoy.findOne(data.resourceId);

    const permission = new Permission();
    permission.name = data.name.toLocaleUpperCase();
    permission.resourceId = resource ? data.resourceId : null;
    await this.permissionRepositoy.save(permission);
    this.roleService.addPermissionToAdmin(permission.id);
    return permission;
  }

  async update(data: CreatePermissionDto): Promise<Permission> {
    const resource = await this.resourceRepositoy.findOne(data.resourceId);

    const permission = await this.permissionRepositoy.findOne(data.id);
    if (!permission) throw new RpcException('Permission id Not Found');

    permission.name = data.name.toLocaleUpperCase();
    permission.resourceId = resource ? data.resourceId : null;
    await this.permissionRepositoy.save(permission);
    return permission;
  }

  async delete(id: number): Promise<boolean> {
    const perm = await this.permissionRepositoy.findOne(id);

    if (!perm) throw new RpcException('Permission id Not Found');

    await this.permissionRepositoy.remove(perm);
    return true;
  }

  async list(): Promise<Permission[]> {
    return await this.permissionRepositoy.find();
  }

  async listPermissionResources() {
    const result = await this.permissionRepositoy.query(
      'SELECT p.*, r.* FROM permissions p LEFT JOIN resources r  ON p."resourceId" = r.id',
    );
    return result;
  }
}
