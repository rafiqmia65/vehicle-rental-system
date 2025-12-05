import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

// "/" -> localhost:5000/
app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Vehicle Rental System app running",
  });
});

// Route not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
