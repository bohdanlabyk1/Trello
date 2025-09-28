import { Controller, Post, Body, Delete, Param, Req, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectService } from './progect.service';
import { JwtService } from '@nestjs/jwt';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('create')
  async createProject(
    @Body() body: { name: string; description?: string },
    @Req() req,
  ) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) throw new HttpException('JWT не надано', HttpStatus.UNAUTHORIZED);
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);

      return this.projectService.createProject(payload.id, body.name, body.description);
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('my')
  async getProjects(@Req() req) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) throw new HttpException('JWT не надано', HttpStatus.UNAUTHORIZED);
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);

      return this.projectService.getUserProjects(payload.id);
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: number, @Req() req) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) throw new HttpException('JWT не надано', HttpStatus.UNAUTHORIZED);
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);

      return this.projectService.deleteProject(payload.id, id);
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
