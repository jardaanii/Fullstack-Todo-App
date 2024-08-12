import { useState, useEffect } from "react";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AuthChoice from "./components/AuthChoice";
import CreateTodo from "./components/CreateTodo";
import Todos from "./components/Todos";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  // consr] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [view, setView] = useState("authChoice"); // "authChoice", "signup", "signin", or "todos"
  const [error, setError] = useState("");

  const handleAuthChoice = (choice) => {
    setView(choice);
    setError("");
  };

  const handleSignUp = async (userData) => {
    const response = await fetch("http://192.168.0.198:3000/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.email,
        password: userData.password,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      setError("User already exists");
    } else {
      setError("");
      setView("signin");
    }
  };

  const handleSignIn = async (userData) => {
    console.log({ username: userData.email, description: userData.password });
    const response = await fetch("http://192.168.0.198:3000/api/v1/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.email,
        password: userData.password,
      }),
    });
    // debugger;
    const data = await response.json();
    if (data.message === "User doesnt exist in our in memory db") {
      setError("User doesnt exist");
    } else if (data.message === "Access denied. Incorrect password.") {
      setError("Invalid email or password");
    } else {
      console.log(data.token);
      setUserToken(data.token);

      setView("todos");
      setError("");
    }
  };

  console.log("BAharWala", userToken);

  const handleSignOut = () => {
    setView("authChoice");
    setError("");
  };

  const handleClick = async (todo) => {
    const { title, description } = todo;

    const response = await fetch("http://192.168.0.198:3000/api/v1/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`,
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

  // useEffect(() => {
  //   const fetchTodos = async () => {
  //     console.log("i ma here");
  //     const response = await fetch("http://localhost:3000/api/v1/todos", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: `Bearer ${userToken}`,
  //       },
  //     });

  //     const data = await response.json();

  //     setTodos(data.todos);
  //   };
  //   fetchTodos();
  // }, [userToken]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!userToken) return; // Ensure token is available
      const response = await fetch("http://192.168.0.198:3000/api/v1/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();
      setTodos(data.todos);
    };
    fetchTodos();
  }, [userToken]);

  const flipCompleted = async (index) => {
    await fetch("http://192.168.0.198:3000/api/v1/completed", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        id: index,
      }),
    });

    const response = await fetch("http://192.168.0.198:3000/api/v1/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`,
      },
    });
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
          <h1>Welcome</h1>
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
