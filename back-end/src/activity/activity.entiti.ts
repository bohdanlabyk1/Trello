import { Entity,PrimaryGeneratedColumn, Column,CreateDateColumn, ManyToOne, RelationId} from 'typeorm';
import { Auth } from '../user/auth-user.entiti';
import { Project } from '../project/project.entiti';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, auth => auth.activityLogs, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: Auth;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ length: 100 })
  action: string;

  @RelationId((log: ActivityLog) => log.project)
projectId: number;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  entityId: number;

  @Column({ type: 'json', nullable: true })
  meta: any;

  @CreateDateColumn()
  createdAt: Date;
}
