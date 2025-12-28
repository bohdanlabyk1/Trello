import React, { useMemo } from 'react';
import { useProjectStore } from '../boards/apiboardc';
import {
  tasksPerColumn,
  tasksPerUser,
  averageTaskCompletionTime,
  sprintProductivity
} from './Analytics.util';
import './../style/analytics.css'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const { columns, tasks, sprints } = useProjectStore();

  const columnStats = useMemo(
    () => tasksPerColumn(columns, tasks),
    [columns, tasks]
  );

  const userStats = useMemo(
    () => tasksPerUser(tasks),
    [tasks]
  );

  const avgTime = useMemo(
    () => averageTaskCompletionTime(tasks),
    [tasks]
  );

  const sprintStats = useMemo(
    () => sprintProductivity(sprints, tasks),
    [sprints, tasks]
  );

  return (
    <div className="analytics">
      <h2>📊 Аналітика проекту</h2>

      {/* ==== KPI ==== */}
      <div className="analytics-cards">
        <div className="card">⏱ Середній час задачі: <b>{avgTime} год</b></div>
        <div className="card">📦 Всього задач: <b>{Object.values(tasks).flat().length}</b></div>
      </div>

      {/* ==== Tasks per column ==== */}
      <h3>📌 Задачі по колонках</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={columnStats}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>

      {/* ==== Sprint productivity ==== */}
      <h3>🚀 Продуктивність спринтів</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sprintStats}>
          <XAxis dataKey="sprint" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="done" />
        </BarChart>
      </ResponsiveContainer>

      {/* ==== Users ==== */}
      <h3>👤 Виконані задачі користувачами</h3>
      <ul>
        {Object.entries(userStats).map(([user, count]) => (
          <li key={user}>{user}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;
