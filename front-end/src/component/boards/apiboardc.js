import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './../api/api';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // ===== UI =====
      theme: localStorage.getItem('theme') || 'light',

      setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        document.body.setAttribute('data-theme', theme);
        set({ theme });
      },
     
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        document.body.setAttribute('data-theme', next);
        set({ theme: next });
      },

      // ===== AUTH =====
      token: localStorage.getItem('token'),

      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },

      clearToken: () => {
        localStorage.removeItem('token');
        set({ token: null });
      },

      // ===== DATA =====
      project: null,
      columns: [],
      tasks: {},
      sprints: [],
      selectedSprintId: null,
      loading: false,

      setProject: (project) => set({ project }),
      setSelectedSprintId: (id) => set({ selectedSprintId: id }),

      // ===== LOAD =====
      loadColumns: async (projectId) => {
        const { token } = get();
        if (!token || !projectId) return;

        set({ loading: true });

        try {
          const columns = await api.getColumnsByProject(token, projectId);
          const tasksArr = await Promise.all(
            columns.map(c => api.getTasksByColumn(token, c.id))
          );

          const tasks = {};
          columns.forEach((c, i) => {
            tasks[c.id] = tasksArr[i];
          });

          set({ columns, tasks, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      loadSprints: async () => {
        const { token, project } = get();
        if (!token || !project) return;

        try {
          const sprints = await api.getSprintsByProject(token, project.id);
          set({ sprints });
        } catch {}
      },

      // ===== COLUMNS =====
      addColumn: async (title) => {
        const { token, project, columns, tasks } = get();
        if (!token || !project) return;

        const newColumn = await api.createColumn(token, title, project.id);
        set({
          columns: [...columns, newColumn],
          tasks: { ...tasks, [newColumn.id]: [] },
        });
      },

      updateColumnTitle: (columnId, title) =>
        set(state => ({
          columns: state.columns.map(c =>
            c.id === columnId ? { ...c, title } : c
          ),
        })),

      updateColumnColor: (columnId, color) =>
        set(state => ({
          columns: state.columns.map(c =>
            c.id === columnId ? { ...c, color } : c
          ),
        })),

      deleteColumn: async (columnId) => {
        const { token, project, columns, tasks } = get();
        if (!token || !project) return;

        await api.deleteColumn(token, project.id, columnId);

        set({
          columns: columns.filter(c => c.id !== columnId),
          tasks: Object.fromEntries(
            Object.entries(tasks).filter(([id]) => String(id) !== String(columnId))
          ),
        });
      },

      // ===== TASKS =====
      addTask: async (columnId, title) => {
        const { token, tasks } = get();

        const task = await api.createTask(
          token,
          title,
          '',
          columnId,
          'low',
          'todo',
          null
        );

        set({
          tasks: {
            ...tasks,
            [columnId]: [...(tasks[columnId] || []), task],
          },
        });
      },

      updateTask: async (
        taskId,
        columnId,
        title,
        description,
        priority,
        status,
        sprintId,
        label
      ) => {
        const { token, tasks } = get();
        if (!token) return;

        const updated = await api.updateTask(
          token,
          taskId,
          title,
          description,
          priority,
          status,
          sprintId,
          label
        );

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
        if (!token) return;

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
          const sourceTasks = [...(state.tasks[sourceColId] || [])];
          const destTasks = [...(state.tasks[destColId] || [])];

          const index = sourceTasks.findIndex(t => t.id === task.id);
          if (index === -1) return {};

          sourceTasks.splice(index, 1);
          destTasks.splice(destIndex, 0, { ...task, columnId: destColId });

          return {
            tasks: {
              ...state.tasks,
              [sourceColId]: sourceTasks,
              [destColId]: destTasks,
            },
          };
        }),
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        theme: state.theme,
        token: state.token,
      }),
    }
  )
);
