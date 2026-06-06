import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './../api/api';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // --- AUTH STATE ---
      token: localStorage.getItem('token'),
      user: null, // Сюди прийде об'єкт { id, email, role, ... }
      theme: "light",

      // Хелпери для перевірки ролей (обчислювальні властивості)
      isAdmin: () => get().user?.role === 'admin',
      isManager: () => get().user?.role === 'manager' || get().user?.role === 'admin',
      isDeveloper: () => get().user?.role === 'developer',

      // --- PROJECT DATA STATE ---
      project: null,
      columns: [],
      tasks: {}, 
      sprints: [],
      comments: {},
      activityLogs: [],
      selectedSprintId: 'all',
      searchQuery: '',
      searchType: 'task',

      // --- AUTH ACTIONS ---
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },
      
      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          token: null, 
          user: null, 
          project: null, 
          columns: [], 
          tasks: {}, 
          sprints: [],
          activityLogs: [],
          comments: {}
        });
      },

      // --- UI ACTIONS ---
      toggleTheme: () => set((state) => ({
        theme: state.theme === "light" ? "dark" : "light",
      })),
      
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchType: (t) => set({ searchType: t }),
      setSelectedSprintId: (id) => set({ selectedSprintId: id }),

      // --- DATA LOADING ---
      loadProjectData: async (projectId) => {
        const { token } = get();
        if (!token || !projectId) return;

        try {
          const [columns, sprints] = await Promise.all([
            api.getColumnsByProject(token, projectId),
            api.getSprintsByProject(token, projectId),
          ]);

          const tasks = {};
          // Завантажуємо таски паралельно для швидкості
          await Promise.all(columns.map(async (col) => {
            const colTasks = await api.getTasksByColumn(token, col.id);
            tasks[col.id] = colTasks.map(t => ({
              ...t,
              columnId: col.id,
              sprintId: t.sprintId ?? null,
            }));
          }));

          set({
            project: { id: projectId },
            columns,
            sprints,
            tasks,
          });
        } catch (error) {
          console.error("Помилка завантаження даних проєкту:", error);
        }
      },

      loadComments: async (taskId) => {
        const { token } = get();
        if (!taskId || !token) return; 
        const data = await api.getCommentsByTask(token, taskId);
        set((state) => ({
          comments: { ...state.comments, [taskId]: data },
        }));
      },

      loadActivityLogs: async (projectId) => {
        const { token } = get();
        const data = await api.getActivityLogs(token, projectId);
        set({ activityLogs: data });
      },

      // --- MUTATIONS (ACTIONS) ---
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
        // Тільки менеджер або адмін може видаляти (логіка на фронті)
        if (!get().isManager()) return alert("Недостатньо прав");

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

      // --- DRAG & DROP LOGIC ---
      moveTaskLocally: (fromCol, toCol, task, index) =>
        set(state => {
          const source = [...(state.tasks[fromCol] || [])];
          const dest = [...(state.tasks[toCol] || [])];

          const taskIndex = source.findIndex(t => t.id === task.id);
          if (taskIndex === -1) return state;

          source.splice(taskIndex, 1);
          dest.splice(index, 0, { ...task, columnId: toCol });

          return {
            tasks: { ...state.tasks, [fromCol]: source, [toCol]: dest },
          };
        }),

      moveTask: async (fromCol, taskId, toCol, order) => {
        const { token } = get();
        try {
          await api.moveTask(token, fromCol, taskId, toCol, order);
        } catch (e) {
          console.error("Move failed", e);
        }
      },
    }),
    {
      name: 'project-store',
      // Вказуємо, які саме поля зберігати в LocalStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);
