import { Entity, Column, CreateDateColumn,  ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from './../user/auth-user.entiti';
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, { onDelete: 'CASCADE' })
  user: Auth;

  @Column({ length: 100 })
  message: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
