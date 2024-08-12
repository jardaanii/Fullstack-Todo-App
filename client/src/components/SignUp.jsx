import "./Auth.css";

function SignUp({ onSignUp, error }) {
  const handleSubmit = () => {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    onSignUp({ email, password });
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>
      {error && <p className="auth-error">{error}</p>}
      <div className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Email" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <button className="auth-button" onClick={handleSubmit}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUp;
