import React, { useEffect, useRef } from "react";
import { useState } from "react";

function ToDoList(props) {
  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("todoList");
  return saved ? JSON.parse(saved) : ["Wake up", "Go to the gym", "Eat proteins"];
});

  const [newTask, setNewTask] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Create a task...");

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask("");
    } else {
      setInputPlaceholder("Please enter a task...");
      inputRef.current.focus();

      setTimeout(() => {
        setInputPlaceholder("Create a task...");
        // input.blur();
      }, 2000);
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const inputRef = useRef(null);

  useEffect(()=>{
    localStorage.setItem("todoList", JSON.stringify(tasks))
  },[tasks])

  return (
    <>
      <div className="to-do-list">
      <h1 className={`text${props.mode}`}>To&nbsp;Do&nbsp;List&nbsp;📋</h1>
        <div className="input-div">
          <input
            ref={inputRef}
            id="input"
            placeholder={inputPlaceholder}
            type="text"
            value={newTask}
            onChange={handleInputChange}
            className={`background${props.mode} text${props.mode}`}
          />

          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        <ol>
          {tasks.map((task, index) => (
            <li className={`list-cell backgroundlist${props.mode}`} key={index} title={task}>
              <div className={`text${props.mode} task-name`}>{task}</div>
              <div>
                <button
                  className={`move-button button${props.mode}`}
                  onClick={() => moveTaskUp(index)}
                  title="Move task up"
                >
                  <i className="fa-solid fa-arrow-up"></i>
                </button>

                <button
                  className={`move-button button${props.mode}`}
                  onClick={() => moveTaskDown(index)}
                  title="Move task down"
                >
                  <i className="fa-solid fa-arrow-down"></i>
                </button>
                <button
                  className={`delete-button button${props.mode}`}
                  onClick={() => removeTask(index)}
                  title="Delete this task"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default ToDoList;
