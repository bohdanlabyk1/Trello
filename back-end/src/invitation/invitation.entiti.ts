// src/invitation/invitation.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Auth } from './../auth-user/auth-user.entiti';
import { Project } from './../progect/project.entiti';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, (user) => user.sentInvitations, { onDelete: 'CASCADE' })
  sender: Auth; // хто запрошує

  @ManyToOne(() => Auth, (user) => user.receivedInvitations, { onDelete: 'CASCADE' })
  recipient: Auth; // кого запрошують

  @ManyToOne(() => Project, (project) => project.invitations, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;
}
