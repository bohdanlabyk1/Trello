import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { Sprint } from './sprint.entity';
import { Project } from './../project/project.entiti';
import { Auth } from './../user/auth-user.entiti';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './../user/jwt-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sprint, Project, Auth]),
    JwtModule.register({
      secret: 'your-secret-key', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [SprintService, JwtAuthGuard],
  controllers: [SprintController],
})
export class SprintModule {}
