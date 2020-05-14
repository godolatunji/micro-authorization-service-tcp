/* tslint:disable: no-console */
import { RoleService } from './role/role.service';

export async function adminRoleSeed(application) {
  try {
    const roleService = application.get(RoleService);

    let role = await roleService.getRoleByName('admin');
    if (!role) {
      role = await roleService.create({ name: 'admin' });
    }

    const user = await roleService.getUserByEmail('developers@cars45.com');
    if (!user) {
      throw new Error('Admin user does not exist on user microservice');
    }
    const userRoles = await roleService.getUserAuthority(user.id);
    if (userRoles.length === 0) {
      await roleService.updateUserRoles([role.id], user.id);
    }
  } catch (err) {
    console.error('Error adding role to admin user >> ', err);
  }
}
