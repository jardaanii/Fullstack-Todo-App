export default function Todos({ todoList, changeCompleted }) {
  const Todoss = todoList.map((todo) => {
    const title = todo.title;
    const description = todo.description;
    const completed = todo.completed;
    const index = todo._id;
    return (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "300px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          margin: "20px auto",
          textAlign: "center",
          backgroundColor: completed ? "rgb(193, 233, 161)" : "",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5em" }}>{title}</h2>
        <p style={{ margin: "0 0 20px 0", fontSize: "1em", color: "#555" }}>
          {description}
        </p>
        <button
          onClick={() => {
            changeCompleted(index);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: completed ? "#4caf50" : "rgb(38, 137, 218)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {completed ? "Completed" : "Mark as Completed"}
        </button>
      </div>
    );
  });

  return <div>{Todoss}</div>;
}
