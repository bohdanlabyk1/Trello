import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './actyviti.entiti';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repo: Repository<ActivityLog>
  ) {}

  async log(data: Partial<ActivityLog>) {
    const activity = this.repo.create(data);
    return this.repo.save(activity);
  }

  async getByProject(projectId: number) {
    return this.repo.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
      take: 200
    });
  }
  async clearProjectLogs(projectId: number) {
  await this.repo.delete({ projectId });
  return { success: true };
}

}
