import React, { useEffect } from "react";
import ToDoList from "./ToDoList";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState(()=>{
    const savedMode = localStorage.getItem("mode");
    return savedMode ? JSON.parse(savedMode) : "light";
  });

  useEffect(()=>{
    document.body.style.backgroundColor = mode === "dark" ? "#232629ff" : "white";
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
      <ToDoList mode={mode} handleModeChange={handleModeChange}></ToDoList>
    </div>
  );
}

export default App;
