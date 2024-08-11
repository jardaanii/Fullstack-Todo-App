import { useState, useEffect } from "react";
import CreateTodo from "./components/CreateTodo";
import Todos from "./components/Todos";
import "./App.css";
function App() {
  const [todos, setTodos] = useState([]);
  const handleClick = async (todo) => {
    const { title, description } = todo;

    const response = await fetch("http://192.168.0.198:3000/api/v1/todo", {
      method: "POST", // Method type
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });
    const data = await response.json();

    const nextTodo = [...todos, data.todo];
    setTodos(nextTodo);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://192.168.0.198:3000/api/v1/todos");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);
  const flipCompleted = async (index) => {
    await fetch("http://192.168.0.198:3000/api/v1/completed", {
      method: "PUT", // Method type
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: index,
      }),
    });

    const response = await fetch("http://192.168.0.198:3000/api/v1/todos");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setTodos(data.todos);
  };
  return (
    <div className="app-container">
      <CreateTodo insertTodo={handleClick} />
      <Todos todoList={todos} changeCompleted={flipCompleted} />
    </div>
  );
}

export default App;
