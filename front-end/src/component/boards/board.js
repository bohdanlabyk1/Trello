import React, { useEffect, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';

const Board = ({ projectId }) => {
  const {
    columns,
  tasks,
  loadProjectData,
  moveTaskLocally,
  moveTask,
  token,
  sprints,
  selectedSprintId,
  setSelectedSprintId,
  } = useProjectStore();

  useEffect(() => {
    if (token && projectId) {
      loadProjectData(projectId);
    }
  }, [token, projectId]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const fromCol = Number(source.droppableId);
    const toCol = Number(destination.droppableId);
    const taskId = Number(draggableId);

    if (fromCol === toCol && source.index === destination.index) return;

    const task = tasks[fromCol]?.find(t => t.id === taskId);
    if (!task) return;

    moveTaskLocally(fromCol, toCol, task, destination.index);

    moveTask(fromCol, taskId, toCol, destination.index);
  };

  const visibleColumns = useMemo(() => {
  return columns.map(col => {
    const columnTasks = tasks[col.id] || [];

    const filteredTasks =
      selectedSprintId === 'all'
        ? columnTasks
        : columnTasks.filter(
            t => String(t.sprintId) === String(selectedSprintId)
          );

    return {
      ...col,
      visibleTasks: filteredTasks,
    };
  });
}, [columns, tasks, selectedSprintId]);
  return (
    <div>
     <select
  className="sprint-select"
  value={selectedSprintId}
  onChange={(e) =>
    setSelectedSprintId(
      e.target.value === 'all' ? 'all' : Number(e.target.value)
    )
  }
>
  <option value="all">Backlog</option>
  {sprints.map((sprint) => (
    <option key={sprint.id} value={sprint.id}>
      {sprint.name}
    </option>
  ))}
</select>
<DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16 }}>
        {visibleColumns.map(col => (
          <Column
            key={col.id}
            column={col}
            tasks={col.visibleTasks}
          />
        ))}
      </div>
    </DragDropContext>
    </div>
    
  );
};

export default Board;