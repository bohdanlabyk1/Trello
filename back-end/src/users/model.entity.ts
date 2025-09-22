import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  taskCount: number;

  @Column({ default: false })
  isPremium: boolean;
  
}
