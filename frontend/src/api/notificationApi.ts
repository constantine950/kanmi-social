import api from "./axios";

export const getNotificationsApi = async () => {
  const res = await api.get("/notifications/get-not");
  return res.data.data;
};

export const markNotificationAsReadApi = async (id: string) => {
  const res = await api.patch(`/notifications/read/${id}`);
  return res.data.data;
};

export const markAllNotificationsAsReadApi = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data;
};
