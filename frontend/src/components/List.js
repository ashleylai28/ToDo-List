import React, { useEffect, useState } from "react";

function List() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [hoveredTask, setHoveredTask] = useState(null);

  function handleInput(event) {
    const { value } = event.target;
    setTask(value);
  }

  async function handleSubmit() {
    if (!task) return;
    try {
      await fetch("http://localhost:3001/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });

      // Add task to UI
      setTaskList((prevTasks) => [...prevTasks, task]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async function handleDelete(taskToDelete) {
    try {
      await fetch("http://localhost:3001/delete-task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskToDelete }),
      });

      // Remove task from UI
      setTaskList((prevTasks) =>
        prevTasks.filter((task) => task !== taskToDelete)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-tasks");
        const data = await response.json();

        setTaskList(
          data
            .filter((item) => item && item[0]?.trim()) // Ensures item exists and isn't empty/whitespace
            .map((item) => item[0])
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>To Do List</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          placeholder="add a task"
          onChange={handleInput}
          onKeyDown={handleEnter}
          value={task}
        ></input>
        <button onClick={handleSubmit}>add</button>
      </div>
      <ul style={{ listStylePosition: "inside", textAlign: "left" }}>
        {taskList.map((todo, index) => (
          <li
            key={index}
            style={{
              textDecoration: hoveredTask === todo ? "line-through" : "none",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredTask(todo)}
            onMouseLeave={() => setHoveredTask(null)}
            onClick={() => handleDelete(todo)}
          >
            {todo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
