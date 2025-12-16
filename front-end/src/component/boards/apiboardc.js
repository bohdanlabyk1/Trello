import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './../api/api';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // ===== AUTH =====
      token: localStorage.getItem('token'),
      setToken: token => {
        localStorage.setItem('token', token);
        set({ token });
      },

      // ===== DATA =====
      columns: [],
      tasks: {},
      sprints: [],
      selectedSprintId: 'all',
      loading: false,

      setSelectedSprintId: id => set({ selectedSprintId: id }),

      // ===== LOAD =====
      loadColumns: async (projectId) => {
        const { token } = get();
        if (!token) return;

        set({ loading: true });

        try {
          const columns = await api.getColumnsByProject(token, projectId);

          const tasks = {};
          columns.forEach(col => {
            tasks[col.id] = (col.tasks || []).sort(
              (a, b) => a.order - b.order
            );
          });

          set({ columns, tasks, loading: false });
        } catch (e) {
          console.error(e);
          set({ loading: false });
        }
      },

      loadSprints: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const sprints = await api.getSprintsByProject(token);
          set({ sprints });
        } catch (e) {
          console.error(e);
        }
      },

      // ===== COLUMNS =====
      addColumn: async (title) => {
        const { token, columns, tasks } = get();
        const col = await api.createColumn(token, title);
        set({
          columns: [...columns, col],
          tasks: { ...tasks, [col.id]: [] },
        });
      },

      updateColumnColor: async (columnId, color) => {
        const { token } = get();
        await api.updateColumnColor(token, columnId, color);

        set(state => ({
          columns: state.columns.map(c =>
            c.id === columnId ? { ...c, color } : c
          ),
        }));
      },

      // ===== TASKS =====
      addTask: async (columnId, title) => {
        const { token, tasks } = get();
        const task = await api.createTask(token, title, '', columnId);

        set({
          tasks: {
            ...tasks,
            [columnId]: [...(tasks[columnId] || []), task],
          },
        });
      },

      updateTask: async (taskId, columnId, data) => {
        const { token, tasks } = get();
        const updated = await api.updateTask(token, taskId, data);

        set({
          tasks: {
            ...tasks,
            [columnId]: tasks[columnId].map(t =>
              t.id === taskId ? updated : t
            ),
          },
        });
      },

      deleteTask: async (taskId, columnId) => {
        const { token, tasks } = get();
        await api.deleteTask(token, columnId, taskId);

        set({
          tasks: {
            ...tasks,
            [columnId]: tasks[columnId].filter(t => t.id !== taskId),
          },
        });
      },

  
      moveTaskLocally: (sourceColId, destColId, task, destIndex) =>
        set(state => {
          const source = [...state.tasks[sourceColId]];
          const dest = [...state.tasks[destColId]];

          source.splice(source.findIndex(t => t.id === task.id), 1);
          dest.splice(destIndex, 0, { ...task, columnId: Number(destColId) });

          source.forEach((t, i) => (t.order = i));
          dest.forEach((t, i) => (t.order = i));

          return {
            tasks: {
              ...state.tasks,
              [sourceColId]: source,
              [destColId]: dest,
            },
          };
        }),

      moveTask: async (taskId, targetColId, newOrder) => {
        const { token } = get();
        await api.moveTask(token, taskId, targetColId, newOrder);
      },
    }),
    {
      name: 'project-store',
      partialize: s => ({ token: s.token }),
    }
  )
);
