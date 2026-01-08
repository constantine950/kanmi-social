import api from "./axios";

export const sendMessage = async (
  receiver: string,
  text?: string,
  image?: File
) => {
  const formData = new FormData();
  formData.append("receiver", receiver);
  if (text) formData.append("text", text);
  if (image) formData.append("image", image);

  return api.post("/message/send", formData);
};

export const getMessages = async (userId: string) => {
  return api.get(`/message/${userId}`);
};

export const deleteMessage = async (messageId: string) => {
  return api.delete(`/message/${messageId}`);
};

export const getChatUsers = async () => {
  return api.get("/message/chats");
};

export const getAllUsers = async () => {
  return api.get("/users/all-users");
};
