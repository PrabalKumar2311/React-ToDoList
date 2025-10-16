import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ToDoList(props) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todoList");
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Wake up" }];
  });

  const [newTask, setNewTask] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Create a task...");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // 🔹 Add task
  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, { id: Date.now(), name: newTask }]);
      setNewTask("");
    } else {
      setInputPlaceholder("Please enter a task...");
      inputRef.current.focus();
      setTimeout(() => setInputPlaceholder("Create a task..."), 2000);
    }
  };

  // 🔹 Delete task
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // 🔹 Move task up/down
  const moveTaskUp = (index) => {
    if (index > 0) {
      const updated = [...tasks];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setTasks(updated);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updated = [...tasks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setTasks(updated);
    }
  };

  // 🔹 Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(tasks));
  }, [tasks]);

  // 🔹 Drag logic
  const dragTask = useRef(0);
  const draggedOverTask = useRef(0);

  function handleSort() {
    const taskClone = [...tasks];
    const temp = taskClone[dragTask.current];
    taskClone[dragTask.current] = taskClone[draggedOverTask.current];
    taskClone[draggedOverTask.current] = temp;
    setTasks(taskClone);
  }

  // 🔹 Edit mode toggle for moving buttons
  const [isEditMode, setIsEditMode] = useState(false);
  function toggleControls() {
    setIsEditMode(!isEditMode);
    setEditingId(null)
  }

  // 🔹 Editing logic
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingValue(item.name);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingId ? { ...task, name: editingValue } : task
      )
    );
    setEditingId(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };


  useEffect(() => {
  if (editingId !== null && editInputRef.current) {
    editInputRef.current.focus();
  }
}, [editingId]);


  return (
    <>
      <div className="to-do-list">
        <div className="heading-div">
          <button
            className={isEditMode ? "edit-btn-pressed" : "edit-btn"}
            onClick={toggleControls}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <h1 className={`${props.mode === "dark" ? "dark-text" : ""}`}>
            📋&nbsp;To&nbsp;Do&nbsp;List
          </h1>

          <div className="btn-div">
            <button
              className={`mode-btn${props.mode}`}
              onClick={props.handleModeChange}
            >
              <i
                className={`fa-solid ${
                  props.mode === "light" ? "fa-sun" : "fa-moon"
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="input-div">
          <input
            ref={inputRef}
            id="input"
            placeholder={inputPlaceholder}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`${props.mode === "dark" ? "dark-input" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />

          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        {/* Task List */}
        <ol>
          {tasks.map((task, index) => (
            <motion.li
              className={`list-cell backgroundlist${props.mode}`}
              key={task.id}
              draggable
              onDragStart={() => (dragTask.current = index)}
              onDragEnter={() => (draggedOverTask.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Task Text / Input */}
              <div
                className={`${
                  props.mode === "dark" ? "dark-text" : ""
                } task-name`}
              >
                {editingId === task.id ? (
                  <div className="input-div edit-input">
                  <input
                  ref={editInputRef}
                    className={`edit-task-input ${props.mode === "dark" ? "dark-input" : ""}`}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                  />

                  </div>
                ) : (
                  <>{task.name}</>
                )}
              </div>

              {/* Buttons Section */}
              <div className="button-div">
                <AnimatePresence mode="wait">
                  {isEditMode && (
                    <motion.div
                      key="move-buttons"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
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
                  )}

                  {!isEditMode && (
                    <motion.div
                      key="edit-delete-buttons"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3 }}
                      className="button-group"
                    >
                      {editingId === task.id ? (
                        <>
                          <button onClick={saveEdit} title="Save">
                            <i className="fa-solid fa-check" style={{color: "#00bc51ff"}}></i>
                          </button>
                          <button onClick={cancelEdit} title="Cancel">
                            <i className="fa-solid fa-xmark" style={{color: "#fa0000"}}></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-button"
                            onClick={() => startEditing(task)}
                            title="Edit task"
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>

                          <button
                            className={`delete-button button${props.mode}`}
                            onClick={() => removeTask(index)}
                            title="Delete this task"
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </>
                      )}
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
