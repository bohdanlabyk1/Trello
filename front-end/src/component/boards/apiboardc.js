import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './../api/api';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      token: localStorage.getItem('token'),
      setToken: token => {
        localStorage.setItem('token', token);
        set({ token });
      },
setUser: (user) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
      project: null,
      columns: [],
      tasks: {}, // { [columnId]: Task[] }
      sprints: [],
      selectedSprintId: 'all',
activityLogs: [],

  loadActivityLogs: async (projectId) => {
  const { token } = get();
  const data = await api.getActivityLogs(token, projectId);
  set({ activityLogs: data });
},
      setSelectedSprintId: id => set({ selectedSprintId: id }),

      // ===== LOAD PROJECT =====
      loadProjectData: async projectId => {
        const { token } = get();
        if (!token || !projectId) return;

        const [columns, sprints] = await Promise.all([
          api.getColumnsByProject(token, projectId),
          api.getSprintsByProject(token, projectId),
        ]);

        const tasks = {};
        for (const col of columns) {
          const colTasks = await api.getTasksByColumn(token, col.id);
          tasks[col.id] = colTasks.map(t => ({
            ...t,
            columnId: col.id,
            sprintId: t.sprintId ?? null,
          }));
        }

        set({
          project: { id: projectId },
          columns,
          sprints,
          tasks,
        });
      },
updateColumnColor: async (columnId, color) => {
  const { token, columns } = get();

  const updated = await api.updateColumnColor(token, columnId, color);

  set({
    columns: columns.map(col =>
      col.id === columnId ? { ...col, color: updated.color } : col
    ),
  });
},
clearActivityLogs: async (projectId) => {
  const { token } = get();
  await api.clearActivityLogs(token, projectId);
  set({ activityLogs: [] });
},

      // ===== TASKS =====
      addTask: async ({ title, columnId, sprintId }) => {
        const { token, tasks } = get();

        const newTask = await api.createTask(token, {
          title,
          columnId,
          sprintId,
          priority: 'medium',
          status: 'todo',
        });

        set({
          tasks: {
            ...tasks,
            [columnId]: [
              ...(tasks[columnId] || []),
              { ...newTask, columnId, sprintId: newTask.sprintId ?? sprintId ?? null },
            ],
          },
        });
      },

      deleteSprint: async (sprintId) => {
  const { token, sprints } = get();
  await api.deleteSprint(token, sprintId);

  set({
    sprints: sprints.filter(s => s.id !== sprintId),
  });
},

      updateTask: async (taskId, columnId, data) => {
        const { token, tasks } = get();
        const updated = await api.updateTask(token, columnId, taskId, data);

        set({
          tasks: {
            ...tasks,
            [columnId]: tasks[columnId].map(t =>
              t.id === taskId
                ? { ...t, ...updated, sprintId: updated.sprintId ?? t.sprintId }
                : t
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

      // ===== DND =====
      moveTaskLocally: (fromCol, toCol, task, index) =>
        set(state => {
          const source = [...state.tasks[fromCol]];
          const dest = [...(state.tasks[toCol] || [])];

          source.splice(source.findIndex(t => t.id === task.id), 1);
          dest.splice(index, 0, { ...task, columnId: toCol });

          return {
            tasks: {
              ...state.tasks,
              [fromCol]: source,
              [toCol]: dest,
            },
          };
        }),

      moveTask: async (fromCol, taskId, toCol, order) => {
        const { token } = get();
        await api.moveTask(token, fromCol, taskId, toCol, order);
      },
    }),
    {
      name: 'project-store',
      partialize: state => ({ token: state.token }),
    }
  )
);
