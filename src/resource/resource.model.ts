import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Permission } from '../permission/permission.model';

@Entity({ name: 'resources' })
export class Resource {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  // @OneToOne(type => Permission, perm => perm.resource)
  // permission: Permission;
}
