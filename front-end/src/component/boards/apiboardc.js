import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './../api/api';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      token: localStorage.getItem('token'),

      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },

      project: null,
      setProject: (project) => set({ project }),

      columns: [],
      tasks: {}, // { [columnId]: Task[] }
      sprints: [],
      selectedSprintId: 'all',

      setSelectedSprintId: (id) => set({ selectedSprintId: id }),

      // ===== LOAD =====
      loadColumns: async (projectId) => {
        const { token } = get();
        const columns = await api.getColumnsByProject(token, projectId);

        const tasks = {};
        columns.forEach(c => {
          tasks[c.id] = [...(c.tasks || [])].sort((a, b) => a.order - b.order);
        });

        set({ columns, tasks });
      },

      loadSprints: async (projectId) => {
        const { token } = get();
        const sprints = await api.getSprintsByProject(token, projectId);
        set({ sprints });
      },

      // ===== TASK UPDATE =====
      updateTask: async (taskId, columnId, data) => {
        const { token, tasks } = get();

        const updated = await api.updateTask(token, taskId, data);

        set({
          tasks: {
            ...tasks,
            [columnId]: tasks[columnId].map(t =>
              t.id === taskId ? { ...t, ...updated } : t
            ),
          },
        });
      },

      // ===== DND =====
      moveTaskLocally: (fromCol, toCol, task, index) =>
        set(state => {
          const source = [...state.tasks[fromCol]];
          const dest = [...state.tasks[toCol]];

          source.splice(source.findIndex(t => t.id === task.id), 1);
          dest.splice(index, 0, { ...task });

          source.forEach((t, i) => (t.order = i));
          dest.forEach((t, i) => (t.order = i));

          return {
            tasks: {
              ...state.tasks,
              [fromCol]: source,
              [toCol]: dest,
            },
          };
        }),

      moveTask: async (taskId, targetCol, order) => {
        const { token } = get();
        await api.moveTask(token, taskId, targetCol, order);
      },
    }),
    { name: 'project-store', partialize: s => ({ token: s.token }) }
  )
);

