"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<{ message: string, check: boolean }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/chat", {
        messages:  input,
      });
      const aiResponse = response.data.response.kwargs.content;
      let trim = aiResponse[0] === `"` ? aiResponse.slice(1, -1) : aiResponse;
      trim = trim[trim.length - 1] === `"` ? trim.slice(0, -1) : trim;
      setTasks(
        [
          ...tasks, 
          {
            message: trim,
            check: false
          }
        ]
      );
      setInput("");
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  const handleCheck = (i: number) => {
    setTasks(prevTasks => prevTasks.map((task, index) => index === i ? { ...task, check: !task.check} : task));
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-center text-3xl font-semibold font-serif"> To-not-do list</h1>
      <div className="w-2/3 flex flex-row justify-center mt-4">
        <input
          type="text"
          disabled={loading}
          placeholder="Add a new task"
          className="p-2 w-3/5"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        />
        <button className="p-2 ml-2"
          onClick={handleAddTask}
          type="button"
          disabled={loading}
        >
          Add
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div className="mt-4 w-2/3">
        <ul className="flex flex-col list-none">
          {tasks.map((task, i) => (
            <div key={`task-${i}`} className="flex flex-row justify-start m-1">
              <input type="checkbox" className="mr-2" onChange={() => handleCheck(i)} />
              <li className={`mr-2 ${tasks[i].check ? "line-through" : ""}`}>{task.message}</li>
              <button
                className=""
                onClick={() => {
                  setTasks(tasks.filter((_, index) => index !== i));
                }}
              >
                remove
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
