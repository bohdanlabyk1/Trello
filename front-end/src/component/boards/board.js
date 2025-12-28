import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';

const Board = ({ projectId }) => {
  const {
    columns,
    tasks,
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    loadProjectData,
    moveTaskLocally,
    moveTask,
    token,
  } = useProjectStore();

  useEffect(() => {
    if (token && projectId) {
      loadProjectData(projectId);
    }
  }, [token, projectId, loadProjectData]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const fromCol = Number(source.droppableId);
    const toCol = Number(destination.droppableId);
    const taskId = Number(draggableId);

    const task = tasks[fromCol]?.find(t => t.id === taskId);
    if (!task) return;

    moveTaskLocally(fromCol, toCol, task, destination.index);
    await moveTask(fromCol, taskId, toCol, destination.index);
  };

  const normalizeSprintId = () => {
    if (selectedSprintId === 'all' || selectedSprintId === 'none') {
      return selectedSprintId;
    }
    return Number(selectedSprintId);
  };

  const sprintFilter = normalizeSprintId();

  return (
    <>
      {/* ===== Sprint filter ===== */}
      <select
        value={selectedSprintId}
        onChange={e => setSelectedSprintId(e.target.value)}
      >
        <option value="all">All</option>
        <option value="none">Backlog</option>
        {sprints.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* ===== Board ===== */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16 }}>
          {columns.map(col => {
            const columnTasks = tasks[col.id] || [];

            const visibleTasks =
              sprintFilter === 'all'
                ? columnTasks
                : sprintFilter === 'none'
                ? columnTasks.filter(t => t.sprintId == null)
                : columnTasks.filter(t => t.sprintId === sprintFilter);

            return (
              <Column
                key={col.id}
                column={col}
                tasks={visibleTasks}
                selectedSprintId={sprintFilter}
                projectId={projectId}
              />
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default Board;
