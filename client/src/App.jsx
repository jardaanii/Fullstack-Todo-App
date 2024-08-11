import { useState, useEffect } from "react";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AuthChoice from "./components/AuthChoice";
import CreateTodo from "./components/CreateTodo";
import Todos from "./components/Todos";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("authChoice"); // "authChoice", "signup", "signin", or "todos"
  const [error, setError] = useState("");

  const handleAuthChoice = (choice) => {
    setView(choice);
    setError("");
  };

  const handleSignUp = async (userData) => {
    // Simulating API call for sign up
    // In a real app, you'd make an actual API call here
    if (userData.email === "existing@example.com") {
      setError("User already exists");
    } else {
      setError("");
      setView("signin");
    }
  };

  const handleSignIn = async (credentials) => {
    // Simulating API call for sign in
    // In a real app, you'd make an actual API call here
    if (
      credentials.email === "user@example.com" &&
      credentials.password === "password"
    ) {
      setUser({ id: 1, email: credentials.email });
      setView("todos");
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setView("authChoice");
    setError("");
  };

  const handleClick = async (todo) => {
    const { title, description } = todo;

    const response = await fetch("http://192.168.0.198:3000/api/v1/todo", {
      method: "POST",
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
    if (user) {
      const fetchTodos = async () => {
        try {
          const response = await fetch(
            "http://192.168.0.198:3000/api/v1/todos"
          );
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
    }
  }, [user]);

  const flipCompleted = async (index) => {
    await fetch("http://192.168.0.198:3000/api/v1/completed", {
      method: "PUT",
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
      {view === "authChoice" && <AuthChoice onChoice={handleAuthChoice} />}
      {view === "signup" && <SignUp onSignUp={handleSignUp} error={error} />}
      {view === "signin" && <SignIn onSignIn={handleSignIn} error={error} />}
      {view === "todos" && (
        <>
          <h1>Welcome, {user.email}!</h1>
          <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </button>
          <CreateTodo insertTodo={handleClick} />
          <Todos todoList={todos} changeCompleted={flipCompleted} />
        </>
      )}
    </div>
  );
}

export default App;
