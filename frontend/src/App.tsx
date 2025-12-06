import { useState } from "react";
import { loginUser } from "./api/authApi";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await loginUser(username, password);

    if (data.success) {
      localStorage.setItem("token", data.data); // save token
      const userInfo = jwtDecode(data.data);
      setMessage(`Welcome ${userInfo.username} ${userInfo.profilePicture.url}`);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div style={{ width: "300px", margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}
