import React, { useEffect } from "react";
import ToDoList from "./ToDoList";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState(()=>{
    const savedMode = localStorage.getItem("mode");
    return savedMode ? JSON.parse(savedMode) : "light";
  });

  useEffect(()=>{
    document.body.style.backgroundColor = mode === "dark" ? "#2f3338" : "white";
  }, [mode])

  let handleModeChange = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "#2f3338";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
    }
  };

  useEffect(()=>{
    localStorage.setItem("mode", JSON.stringify(mode));
  },[mode])

  return (
    <div>
      <div className="btn-div">
        <button
          /* add moon-btn only in dark mode */
          className={`mode-btn${mode}`}
          onClick={handleModeChange}
          aria-label={
            mode === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          <i
            className={`fa-solid ${mode === "light" ? "fa-sun" : "fa-moon"}`}
          ></i>
        </button>
      </div>

      <ToDoList mode={mode} handleModeChange={handleModeChange}></ToDoList>
    </div>
  );
}

export default App;
