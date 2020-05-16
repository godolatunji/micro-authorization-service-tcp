import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as shortid from 'shortid';
import { EntityManager, In, Repository } from 'typeorm';
import { Permission } from '../permission/permission.model';
import { Role } from '../role/role.model';
import {
  generateToken,
  getKeyPair,
  getRandomString,
  ISecret,
} from '../shared/auth';
import { TYPES } from '../types';
import { RoleKeys } from './role-key.model';
import { RoleDto } from './role.dto';
import { UserRole } from './user-role.model';

@Injectable()
export class RoleService {
  private readonly permissionRepositoy: Repository<Permission>;
  private readonly roleRepositoy: Repository<Role>;
  private readonly userRoleRepositoy: Repository<UserRole>;
  private readonly roleKeysRepositoy: Repository<RoleKeys>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @Inject(TYPES.USER_SVC) private readonly userSvc: ClientProxy,
  ) {
    this.permissionRepositoy = entityManager.getRepository(Permission);
    this.roleRepositoy = entityManager.getRepository(Role);
    this.userRoleRepositoy = entityManager.getRepository(UserRole);
    this.roleKeysRepositoy = entityManager.getRepository(RoleKeys);
  }

  async create(data: RoleDto): Promise<Role> {
    const role = new Role();
    role.id = shortid.generate();
    role.name = data.name.trim();
    await this.roleRepositoy.save(role);
    return role;
  }

  async update(data: RoleDto): Promise<Role> {
    const role = await this.roleRepositoy.findOne(data.id);
    if (!role) throw new RpcException('Role id Not Found');

    role.name = data.name.trim();
    await this.roleRepositoy.save(role);
    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    return this.roleRepositoy.findOne({ name });
  }

  async delete(id: string): Promise<boolean> {
    const role = await this.roleRepositoy.findOne(id);

    if (!role) throw new RpcException('Role id Not Found');

    role.permissions = [];
    await this.roleRepositoy.save(role);

    await this.roleRepositoy.remove(role);
    return true;
  }

  async list(): Promise<Role[]> {
    return await this.roleRepositoy.find();
  }

  async updatePermissions(data: RoleDto): Promise<Role> {
    const role = await this.roleRepositoy.findOne({
      where: { id: data.id },
      relations: ['permissions'],
    });
    if (!role) throw new RpcException('Role id Not Found');

    role.permissions = [];
    await this.roleRepositoy.save(role);

    const perms = await this.permissionRepositoy.findByIds(data.permissionIds);
    role.permissions = perms;
    await this.roleRepositoy.save(role);

    return role;
  }

  async addPermissionToRole(
    roleId: string,
    permissionId: number,
  ): Promise<Role> {
    const role = await this.roleRepositoy.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) throw new RpcException('Role id Not Found');

    const perm = await this.permissionRepositoy.findOne(permissionId);
    if (!perm) throw new RpcException('Permission id Not Found');
    role.permissions.push(perm);
    await this.roleRepositoy.save(role);
    return role;
  }

  async updateUserRoles(roleIds: string[], userId: string): Promise<boolean> {
    const userRoles = roleIds.map(r => {
      const ur = new UserRole();
      ur.roleId = r;
      ur.userId = userId;
      return ur;
    });
    const oldUserRoles = await this.userRoleRepositoy.find({
      where: { userId },
    });
    await this.userRoleRepositoy.remove(oldUserRoles);
    await this.userRoleRepositoy.save(userRoles);
    return true;
  }

  async getUserByEmail(email: string) {
    const user = await this.userSvc
      .send<any>({ cmd: 'getUserByEmail' }, email)
      .toPromise();
    return user;
  }

  async getUserAuthority(userId: string): Promise<any> {
    const userRoles = await this.userRoleRepositoy.find({ where: { userId } });
    if (userRoles.length === 0) return [];
    const rolesIds = userRoles.map(doc => doc.roleId);

    const roles = await this.roleRepositoy.find({
      where: {
        id: In(rolesIds),
      },
      relations: ['permissions'],
    });

    const permSet = new Set();
    const rolesClean = roles.map(doc => {
      doc.permissions.map(d => permSet.add(d.name));
      return doc.name;
    });

    return {
      roles: rolesClean,
      permissions: [...permSet],
    };
  }

  async addPermissionToAdmin(permissionId: number): Promise<void> {
    const adminRole = await this.getRoleByName('admin');
    this.addPermissionToRole(adminRole.id, permissionId);
  }

  async login(headers, data): Promise<any> {
    try {
      const user = await this.userSvc
        .send<any>({ cmd: 'loginUser' }, data)
        .toPromise();

      delete user.password;
      const auth = await this.getUserAuthority(user.id);
      user.roles = auth.roles;
      user.permissions = auth.permissions;
      const { secret } = await this.getSecret();
      user.token = generateToken(user, secret);
      return user;
    } catch (err) {
      throw new RpcException('Error authenticating user: ' + err.message);
    }
  }

  async generateSecret(): Promise<void> {
    const secret = getRandomString();
    const roleKeys = await this.roleKeysRepositoy.find();
    if (roleKeys.length === 0) {
      const roleKey = new RoleKeys();
      roleKey.secret = secret;
      await this.roleKeysRepositoy.save(roleKey);
    }
  }

  async getSecret(): Promise<ISecret> {
    const roleKeys = await this.roleKeysRepositoy.find();
    return { secret: roleKeys[0].secret };
  }
}
