import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Permission } from '../permission/permission.model';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToMany(type => Permission, null, { cascade: true })
  @JoinTable()
  permissions: Permission[];
}
