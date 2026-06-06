import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from './../boards/apiboardc';
import './../style/sprint.css';
import Task from './../boards/Task';

const SprintTasks = () => {
  const { sprintId, projectId } = useParams();
  const navigate = useNavigate();

  const { tasks, sprints, loadProjectData } = useProjectStore();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && projectId) {
      loadProjectData(projectId);
    }
  }, [token, projectId, loadProjectData]);

  const sprint = sprints.find(s => String(s.id) === String(sprintId));

  if (!sprint) {
    return (
      <div>
        <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
        <p>Спринт не знайдений</p>
      </div>
    );
  }

  const sprintTasks = Object.values(tasks)
    .flat()
    .filter(t => String(t.sprintId) === String(sprint.id));

  return (
    <div className="sprint-tasks">
      <button onClick={() => navigate(-1)}>← Назад</button>
      <h2>{sprint.name}</h2>

      {sprintTasks.length === 0 ? (
        <p>Немає задач у цьому спринті</p>
      ) : (
        sprintTasks.map(task => (
          <Task key={task.id} task={task} columnId={task.columnId} />
        ))
      )}
    </div>
  );
};
export default SprintTasks