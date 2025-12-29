import api from "./axios";

export const getMe = () => api.get("/users/me");

export const updateUsername = (username: string) =>
  api.patch("/users/update-username", { username });

export const updateBio = (bio: string) =>
  api.patch("/users/update-bio", { bio });

export const updatePassword = (data: {
  password: string;
  newPassword: string;
}) => api.patch("/users/update-password", data);

export const updateProfilePicture = (formData: FormData) =>
  api.patch("/users/update-profile-picture", formData);

export const deleteUser = () => api.delete("/users/delete-user");
