import React, { useEffect, useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useDebounce } from './../Sreach/util';
import { useProjectStore } from './apiboardc';

/* ================================
   🔎 Fuzzy Search
================================ */
const fuzzyMatch = (text, query) => {
  if (!text) return false;

  text = text.toLowerCase();
  query = query.toLowerCase();

  let tIndex = 0;
  let qIndex = 0;

  while (tIndex < text.length && qIndex < query.length) {
    if (text[tIndex] === query[qIndex]) {
      qIndex++;
    }
    tIndex++;
  }

  return qIndex === query.length;
};

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

    /* 🔎 SEARCH FROM STORE */
    searchQuery,
    searchType,
  } = useProjectStore();

  const debouncedSearch = useDebounce(searchQuery, 300);

  /* ================================
     📦 Load project
  ================================ */
  useEffect(() => {
    if (token && projectId) {
      loadProjectData(projectId);
    }
  }, [token, projectId, loadProjectData]);

  /* ================================
     🖱 Drag & Drop
  ================================ */
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

  /* ================================
     🏃 Sprint normalize
  ================================ */
  const normalizeSprintId = () => {
    if (selectedSprintId === 'all' || selectedSprintId === 'none') {
      return selectedSprintId;
    }
    return Number(selectedSprintId);
  };

  const sprintFilter = normalizeSprintId();

  /* ================================
     🔎 FILTER LOGIC
  ================================ */
  const filterTasks = (columnTasks) => {
    let filtered = columnTasks;

    /* Sprint filter */
    if (sprintFilter !== 'all') {
      if (sprintFilter === 'none') {
        filtered = filtered.filter(t => t.sprintId == null);
      } else {
        filtered = filtered.filter(t => t.sprintId === sprintFilter);
      }
    }

    /* Search */
    if (!debouncedSearch) return filtered;

    return filtered.filter(task => {
      const sprintName =
        sprints.find(s => s.id === task.sprintId)?.name || '';

      switch (searchType) {
        case 'task':
          return fuzzyMatch(task.title || '', debouncedSearch);

        case 'user':
          return fuzzyMatch(
            task.assignee?.name || '',
            debouncedSearch
          );

        case 'sprint':
          return fuzzyMatch(sprintName, debouncedSearch);

        default:
          return true;
      }
    });
  };

  /* ================================
     🧠 Memo columns
  ================================ */
  const visibleColumns = useMemo(() => {
    return columns.map(col => {
      const columnTasks = tasks[col.id] || [];

      return {
        ...col,
        visibleTasks: filterTasks(columnTasks),
      };
    });
  }, [
    columns,
    tasks,
    debouncedSearch,
    sprintFilter,
    searchType,
  ]);

  /* ================================
     🎨 Render
  ================================ */
  return (
    <>
      {/* 🏃 Sprint Filter */}
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

      {/* 📋 Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16 }}>
          {visibleColumns.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={col.visibleTasks}
              selectedSprintId={sprintFilter}
              projectId={projectId}
            />
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default Board;
