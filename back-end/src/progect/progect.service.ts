import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './project.entiti';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projeckRepositori: Repository<Project>
    ) {}
    async createProject(userId: number, name: string, description:string) {
        const project = this.projeckRepositori.create({
            name,
            description,
            user: {id: userId} as any,
        });
        return this.projeckRepositori.save(project);
    }

    async getUserProjects(userId: number){
       return this.projeckRepositori.find({where :{user: { id :userId}},});
    }
    async deleteProject(userId: number, projectId: number){
        const project = await this.projeckRepositori.findOne({
    where: { id: projectId, user: { id: userId } }, 
    relations: ['user'], 
  });
        await this.projeckRepositori.remove(project);
          return { message: 'Проєкт видалено' }; 
    }
}
