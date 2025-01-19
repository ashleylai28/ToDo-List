import React from "react";

function List() {
  const [task, setTask] = React.useState("");
  const [taskList, setTaskList] = React.useState([]);

  function handleInput(event) {
    const { value } = event.target;
    setTask(value);
  }

  function handleSubmit() {
    setTaskList((prevTasks) => [...prevTasks, task]);
    setTask("");
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

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
        {taskList.map((todo) => (
          <li>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default List;
