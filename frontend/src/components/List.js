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
    if (!task.trim()) return;
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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{ textAlign: "center", color: "#2d3436", marginBottom: "20px" }}
      >
        Ashley's To Do List
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Add a task"
          onChange={handleInput}
          onKeyDown={handleEnter}
          value={task}
          style={{
            padding: "10px",
            width: "400px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "1px solid #3498db",
            backgroundColor: "#3498db",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          Add
        </button>
      </div>
      <ul
        style={{
          listStyleType: "none",
          padding: "0",
          margin: "0",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {taskList.map((todo, index) => (
          <li
            key={index}
            style={{
              padding: "10px",
              backgroundColor: hoveredTask === todo ? "#e0e0e0" : "#ffffff",
              margin: "10px 0",

              wordWrap: "break-word", // Ensures text wraps to the next line
              overflowWrap: "break-word",
              borderRadius: "5px",
              cursor: "pointer",
              boxShadow:
                hoveredTask === todo ? "0 2px 5px rgba(0, 0, 0, 0.1)" : "none",
              transition: "background-color 0.2s, box-shadow 0.2s",
              textDecoration: hoveredTask === todo ? "line-through" : "none",
              color: hoveredTask === todo ? "#bbb" : "#2d3436",
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
