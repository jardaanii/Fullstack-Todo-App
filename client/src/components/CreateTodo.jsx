import React from "react";
import "./CreateTodo.css";

export default function CreateTodo({ insertTodo }) {
  function sendTodo() {
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const response = {
      title: title,
      description: description,
      completed: false,
    };
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";

    insertTodo(response);
  }
  return (
    <div className="create-todo-container">
      <h2 className="form-title">Create a New Todo</h2>
      <div className="input-group">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" placeholder="Enter todo title" />
      </div>
      <div className="input-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          placeholder="Enter todo description"
        />
      </div>
      <button onClick={sendTodo} className="submit-button">
        Add Todo
      </button>
    </div>
  );
}
