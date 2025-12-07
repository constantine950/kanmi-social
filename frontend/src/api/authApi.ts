import { jwtDecode } from "jwt-decode";
import { socket } from "../socket";

export const loginUser = async (username: string, password: string) => {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();
  const userInfo = jwtDecode(data.data);

  socket.emit("register", userInfo.user_id);
  return data;
};

export const createComment = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:3000/api/posts/6929c22257178da76a43e18a/like",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return data;
};
