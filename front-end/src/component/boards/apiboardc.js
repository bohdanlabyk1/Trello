import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../api/api';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      token: localStorage.getItem('token') || null,
      project: null,
      columns: [],
      tasks: {},
      comments: {},
      sprints: [],
      loading: false,
      error: null,

      // 🔹 Token
      setToken: (token) => set({ token }),

      // 🔹 Проект
      setProject: (project) => set({ project }),

      // 🔹 Завантажити колонки і задачі
      loadColumns: async () => {
        const { token, project } = get();
        if (!token || !project) return;
        set({ loading: true });
        try {
          const columns = await api.getColumnsByProject(token, project.id);
          const tasks = {};
          for (const col of columns) {
            tasks[col.id] = await api.getTasksByColumn(token, col.id);
          }
          set({ columns, tasks, loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      // 🔹 Колонки
      addColumn: async (title) => {
        const { token, project, columns, tasks } = get();
        if (!token || !project) return;
        const newCol = await api.createColumn(token, title, project.id);
        set({ 
          columns: [...columns, newCol], 
          tasks: { ...tasks, [newCol.id]: [] } 
        });
      },

      updateColumnTitle: async (columnId, title) => {
        const { token, columns } = get();
        await api.updateColumn(token, columnId, title);
        set({
          columns: columns.map(c => c.id === columnId ? { ...c, title } : c)
        });
      },

      deleteColumn: async (columnId) => {
        const { token, columns, tasks } = get();
        await api.deleteColumn(token, columnId);
        const newTasks = { ...tasks };
        delete newTasks[columnId];
        set({
          columns: columns.filter(c => c.id !== columnId),
          tasks: newTasks
        });
      },

      // 🔹 Задачі
      addTask: async (columnId, title, description='') => {
        const { token, tasks } = get();
        const newTask = await api.createTask(token, title, description, columnId);
        set({
          tasks: {
            ...tasks,
            [columnId]: [...(tasks[columnId] || []), newTask],
          }
        });
      },

      updateTask: async (taskId, columnId, title, description) => {
        const { token, tasks } = get();
        await api.updateTask(token, taskId, title, description);
        set({
          tasks: {
            ...tasks,
            [columnId]: tasks[columnId].map(t =>
              t.id === taskId ? { ...t, title, description } : t
            )
          }
        });
      },

      deleteTask: async (taskId, columnId) => {
        const { token, tasks } = get();
        await api.deleteTask(token, columnId, taskId);
        set({
          tasks: {
            ...tasks,
            [columnId]: tasks[columnId].filter(t => t.id !== taskId)
          }
        });
      },

      moveTaskLocally: (sourceColId, destColId, task, newIndex) => {
        set(state => {
          const sourceTasks = [...(state.tasks[sourceColId] || [])];
          const destTasks = [...(state.tasks[destColId] || [])];
          const index = sourceTasks.findIndex(t => t.id === task.id);
          if (index !== -1) sourceTasks.splice(index, 1);
          destTasks.splice(newIndex, 0, task);
          return {
            tasks: {
              ...state.tasks,
              [sourceColId]: sourceTasks,
              [destColId]: destTasks
            }
          };
        });
      },

      // 🔹 Коментарі
      loadComments: async (taskId) => {
        const { token, comments } = get();
        const data = await api.getCommentsByTask(token, taskId);
        set({ comments: { ...comments, [taskId]: data } });
      },

      createComment: async (taskId, text) => {
        const { token } = get();
        await api.createComment(token, text, taskId);
        get().loadComments(taskId);
      },

      // 🔹 Спринти
      loadSprints: async () => {
        const { token, project } = get();
        if (!token || !project) return;
        const data = await api.getSprintsByProject(token, project.id);
        set({ sprints: data });
      },

      createSprint: async ({ name, startDate, endDate }) => {
        const { token, project, sprints } = get();
        const newSprint = await api.createSprint(token, name, startDate, endDate, project.id);
        set({ sprints: [...sprints, newSprint] });
      }

    }),
    { name: 'project-store' }
  )
);
