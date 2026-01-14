import express from "express";

const homeRoute = express.Router();

homeRoute.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Kanmi API is running",
    timestamp: new Date(),
  });
});

export default homeRoute;
