import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ToDoList(props) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todoList");
    return saved ? JSON.parse(saved) : ["Wake up"];
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

  // DRAG LOGIC
  const dragTask = useRef(0);
  const draggedOverTask = useRef(0);

  function handleSort() {
    const taskClone = [...tasks];
    const temp = taskClone[dragTask.current];
    taskClone[dragTask.current] = taskClone[draggedOverTask.current];
    taskClone[draggedOverTask.current] = temp;
    setTasks(taskClone);
  }

  // EDIT BUTTON

  const [isEditMode, setIsEditMode] = useState(false);

  function toggleEdit() {
    setIsEditMode(!isEditMode);
  }

  return (
    <>
      <div className="to-do-list">
        <div className="heading-div">
          <button
            className={isEditMode ? "edit-btn-pressed" : "edit-btn"}
            onClick={toggleEdit}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <h1 className={`${props.mode === "dark" ? "dark-text" : ""}`}>
            📋&nbsp;To&nbsp;Do&nbsp;List
          </h1>

          <div className="btn-div">
            <button
              /* add moon-btn only in dark mode */
              className={`mode-btn${props.mode}`}
              onClick={props.handleModeChange}
              aria-label={
                props.mode === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <i
                className={`fa-solid ${
                  props.mode === "light" ? "fa-sun" : "fa-moon"
                }`}
              ></i>
            </button>
          </div>
        </div>

        <div className="input-div">
          <input
            ref={inputRef}
            id="input"
            placeholder={inputPlaceholder}
            type="text"
            value={newTask}
            onChange={handleInputChange}
            className={`${props.mode === "dark" ? "dark-input" : ""}`}
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
          {tasks.map((task, index) => (
            <motion.li
              className={`list-cell backgroundlist${props.mode}`}
              key={index}
              title={task}
              draggable
              onDragStart={() => (dragTask.current = index)}
              onDragEnter={() => (draggedOverTask.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              // Drag animation
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className={`${
                  props.mode === "dark" ? "dark-text" : ""
                } task-name`}
              >
                {task}
              </div>
              <div className="button-div">
                <AnimatePresence mode="wait">
                  {isEditMode ? (
                    <motion.div
                      key="move-buttons"
                      initial={{ opacity: 0, x: 30 }} // start off to the right
                      animate={{ opacity: 1, x: 0 }} // slide in to place
                      exit={{ opacity: 0, x: 30 }} // exit back to the right
                      transition={{ duration: 0.3 }}
                      className="button-group"
                    >
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
                    </motion.div>
                  ) : (
                    <motion.div
                      key="edit-delete-buttons"
                      initial={{ opacity: 0, x: 30 }} // start off to the right
                      animate={{ opacity: 1, x: 0 }} // slide in to place
                      exit={{ opacity: 0, x: 30 }} // exit back to the right
                      transition={{ duration: 0.3 }}
                      className="button-group"
                    >
                      <button className="edit-button">
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>

                      <button
                        className={`delete-button button${props.mode}`}
                        onClick={() => removeTask(index)}
                        title="Delete this task"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default ToDoList;
