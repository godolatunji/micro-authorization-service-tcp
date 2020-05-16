import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role_keys' })
export class RoleKeys {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  secret: string;
}
