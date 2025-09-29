import { Module } from '@nestjs/common';
import { ColumnsService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ColumnsController } from './column.controller';
import { ColumnEntity } from './column.entity';
import { Project } from 'src/progect/project.entiti';

@Module({
   imports: [TypeOrmModule.forFeature([ColumnEntity, Project])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnModule {}
