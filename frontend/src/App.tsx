import { useState } from "react";
import { createComment } from "./api/authApi";
import { loginUser } from "./api/authApi";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const fd = new FormData();

    fd.append("text", text);
    fd.append("receiver", "6928870c1f4bbb25d14cd8a8");
    if (file) {
      fd.append("image", file);
    }

    const res = await fetch("http://localhost:3000/api/message/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    const data = await res.json();
    console.log(data);

    // const data = await createComment();
    // console.log(data);

    // const data = await loginUser(username, password);

    // if (data.success) {
    //   localStorage.setItem("token", data.data); // save token
    //   const userInfo = jwtDecode(data.data);
    //   setMessage(`Welcome ${userInfo.username} ${userInfo.profilePicture.url}`);
    // } else {
    //   setMessage(data.message);
    // }
  };

  return (
    <div style={{ width: "300px", margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          // value={username}
          value={text}
          // onChange={(e) => setUsername(e.target.value)}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
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

      {/* {message && <p style={{ marginTop: "15px" }}>{message}</p>} */}
    </div>
  );
}
