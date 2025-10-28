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
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },

      // 🔹 Проект
      setProject: (project) => set({ project }),

      // 🔹 Колонки та задачі
      loadColumns: async () => {
        const { token, project } = get();
        if (!token || !project) return;
        set({ loading: true });

        try {
          const columns = await api.getColumnsByProject(token, project.id);

          const tasksArrays = await Promise.all(
            columns.map(col => api.getTasksByColumn(token, col.id))
          );

          const tasks = {};
          columns.forEach((col, idx) => {
            tasks[col.id] = tasksArrays[idx];
          });

          set({ columns, tasks, loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      addColumn: async (title) => {
        const { token, project, columns, tasks } = get();
        if (!token || !project) return;

        try {
          const newCol = await api.createColumn(token, title, project.id);
          set({ 
            columns: [...columns, newCol], 
            tasks: { ...tasks, [newCol.id]: [] } 
          });
        } catch (err) {
          set({ error: err.message });
        }
      },

      updateColumnTitle: async (columnId, title) => {
        const { token, columns } = get();
        if (!token) return;

        try {
          await api.updateColumn(token, columnId, title);
          set({
            columns: columns.map(c => c.id === columnId ? { ...c, title } : c)
          });
        } catch (err) {
          set({ error: err.message });
        }
      },

      deleteColumn: async (columnId) => {
        const { token, columns, tasks, project } = get();
        if (!token || !project) return;

        try {
          await api.deleteColumn(token, project.id, columnId);
          const newTasks = { ...tasks };
          delete newTasks[columnId];
          set({
            columns: columns.filter(c => c.id !== columnId),
            tasks: newTasks
          });
        } catch (err) {
          set({ error: err.message });
        }
      },

      addTask: async (columnId, title, description='') => {
        const { token, tasks } = get();
        if (!token) return;

        try {
          const newTask = await api.createTask(token, title, description, columnId);
          set({
            tasks: {
              ...tasks,
              [columnId]: [...(tasks[columnId] || []), newTask],
            }
          });
        } catch (err) {
          set({ error: err.message });
        }
      },

      updateTask: async (taskId, columnId, title, description) => {
        const { token, tasks } = get();
        if (!token) return;

        try {
          await api.updateTask(token, taskId, title, description);
          set({
            tasks: {
              ...tasks,
              [columnId]: tasks[columnId].map(t =>
                t.id === taskId ? { ...t, title, description } : t
              )
            }
          });
        } catch (err) {
          set({ error: err.message });
        }
      },

      deleteTask: async (taskId, columnId) => {
        const { token, tasks } = get();
        if (!token) return;

        try {
          await api.deleteTask(token, columnId, taskId);
          set({
            tasks: {
              ...tasks,
              [columnId]: tasks[columnId].filter(t => t.id !== taskId)
            }
          });
        } catch (err) {
          set({ error: err.message });
        }
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

      // 🔹 Спринти
      loadSprints: async () => {
        const { token, project } = get();
        if (!token || !project) return;

        try {
          const data = await api.getSprintsByProject(token, project.id);
          set({ sprints: data });
        } catch (err) {
          set({ error: err.message });
        }
      },

      createSprint: async ({ name, startDate, endDate }) => {
        const { token, project, sprints } = get();
        if (!token || !project) return;

        try {
          const newSprint = await api.createSprint(token, { name, startDate, endDate, projectId: project.id });
          set({ sprints: [...sprints, newSprint] });
        } catch (err) {
          set({ error: err.message });
        }
      }

    }),
    { name: 'project-store' }
  )
);
