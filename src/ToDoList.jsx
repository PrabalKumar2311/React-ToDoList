import React, { useEffect, useRef } from "react";
import { useState } from "react";

function ToDoList(props) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todoList");
    return saved
      ? JSON.parse(saved)
      : ["Wake up (Optional)"];
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
    setTasks(tasks.filter((element, i) => i !== index));
    //.filter takes in 2 parameters element & index, 
    // index is the index of element we want to filter out.
    // we rename this to i here to avoid any naming conflicts 
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

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <div className="to-do-list">
        <h1 className={`${props.mode === 'dark' ? 'dark-text' : ''}`}>📋&nbsp;To&nbsp;Do&nbsp;List</h1>
        <div className="input-div">
          <input
            ref={inputRef}
            id="input"
            placeholder={inputPlaceholder}
            type="text"
            value={newTask}
            onChange={handleInputChange}
            className={`${props.mode === 'dark' ? 'dark-input' : ''}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        <ol>
          {tasks.map((task, index) => 
            <li className={`list-cell backgroundlist${props.mode}`} key={index} title={task}>
              <div className={`${props.mode === 'dark' ? 'dark-text' : ''} task-name`}>{task}</div>
              <div className="button-div">
                <button
                  className={`move-button move-button${props.mode}`}
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
          )}
        </ol>
      </div>
    </>
  );
}

export default ToDoList;