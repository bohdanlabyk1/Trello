export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  label?: string;
  sprintId?: number | null;
}
