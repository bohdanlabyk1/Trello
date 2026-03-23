import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Auth } from './../user/auth-user.entiti';
import { Project } from './../project/project.entiti';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, (user) => user.sentInvitations, { onDelete: 'CASCADE' })
  sender: Auth; // хто запрошує

  @Column({ default: false })
  isRead: boolean;
  
  @ManyToOne(() => Auth, (user) => user.receivedInvitations, { onDelete: 'CASCADE' })
  recipient: Auth; // кого запрошують

  @ManyToOne(() => Project, (project) => project.invitations, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;
}
