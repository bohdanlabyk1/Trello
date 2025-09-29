import { create } from 'zustand';
import * as api from './../api/api';

export const useBoardStore = create((set) => ({
  columns: [],
  tasks: {},
  comments: {},

  // Завантажити колонки та задачі для проекту
  loadColumns: async (token, projectId) => {
    const columns = await api.getColumnsByProject(token, projectId);
    const tasks = {};
    for (const col of columns) {
      tasks[col.id] = await api.getTasksByColumn(token, col.id);
    }
    set({ columns, tasks });
  },

  // Коментарі для задачі
  loadComments: async (token, taskId) => {
    const comments = await api.getCommentsByTask(token, taskId);
    set(state => ({ comments: { ...state.comments, [taskId]: comments } }));
  },

  // Колонки
  addColumn: async (token, title, projectId) => {
    const newCol = await api.createColumn(token, title, projectId);
    set(state => ({ columns: [...state.columns, newCol], tasks: { ...state.tasks, [newCol.id]: [] } }));
  },
  updateColumnTitle: async (token, columnId, title) => {
    await api.updateColumn(token, columnId, title);
    set(state => ({
      columns: state.columns.map(c => (c.id === columnId ? { ...c, title } : c))
    }));
  },
  deleteColumnById: async (token, columnId) => {
    await api.deleteColumn(token, columnId);
    set(state => {
      const newTasks = { ...state.tasks };
      delete newTasks[columnId];
      return { columns: state.columns.filter(c => c.id !== columnId), tasks: newTasks };
    });
  },

  // Задачі
  addTask: async (token, title, description, columnId) => {
    const newTask = await api.createTask(token, title, description, columnId);
    set(state => ({ tasks: { ...state.tasks, [columnId]: [...state.tasks[columnId], newTask] } }));
  },
  updateTask: async (token, taskId, title, description, columnId) => {
    await api.updateTask(token, taskId, title, description);
    set(state => ({
      tasks: {
        ...state.tasks,
        [columnId]: state.tasks[columnId].map(t => (t.id === taskId ? { ...t, title, description } : t))
      }
    }));
  },
  deleteTaskById: async (token, taskId, columnId) => {
    await api.deleteTask(token, taskId);
    set(state => ({ tasks: { ...state.tasks, [columnId]: state.tasks[columnId].filter(t => t.id !== taskId) } }));
  },

  // Локальне переміщення задач
  moveTaskLocally: (sourceColId, destColId, task, newIndex) => {
    set(state => {
      const sourceTasks = [...state.tasks[sourceColId]];
      const destTasks = [...state.tasks[destColId]];

      const index = sourceTasks.findIndex(t => t.id === task.id);
      sourceTasks.splice(index, 1);
      destTasks.splice(newIndex, 0, task);

      return { tasks: { ...state.tasks, [sourceColId]: sourceTasks, [destColId]: destTasks } };
    });
  },
}));
