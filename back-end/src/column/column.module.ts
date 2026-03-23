import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ColumnController } from './column.controller';
import { ColumnEntity } from './column.entity';
import { Project } from 'src/project/project.entiti';
import { AuthUserModule } from 'src/user/auth-user.module';

@Module({
   imports: [TypeOrmModule.forFeature([ColumnEntity, Project]),
  AuthUserModule],
  controllers: [ColumnController],
  providers: [ColumnService],
    exports: [ColumnService]
})
export class ColumnModule {}
