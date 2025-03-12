import express from "express";
import { google } from "googleapis";
import bodyParser from "body-parser";
import cors from "cors";
import creds from "./todolist-453515-cbbd2279141f.json" assert { type: "json" };

const app = express();
const PORT = 3001;

// enable CORS
app.use(cors());

// parse JSON requests
app.use(express.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Your spreadsheet ID
const SPREADSHEET_ID = "1NZA3YSUsE5Ej-ZTHZxagYvCe0zY4JkalcMa1VHgzFb8";

// Post endpoint to add task
app.post("/add-task", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  console.log("Received task:", task); // Add this to check the received task

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:A",
      valueInputOption: "RAW",
      requestBody: {
        values: [[task]],
      },
    });
    res.status(200).json({ message: "Task added successfully!" });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Get endpoint to fetch tasks from google sheets
app.get("/get-tasks", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:A", // Range for the tasks (adjust the range if needed)
    });
    const tasks = response.data.values || []; // If no data, return an empty array
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Delete endpoint to delete a task from google sheets
app.delete("/delete-task", async (req, res) => {
  console.log("hi");
  const { task } = req.body;
  console.log("task", task);

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:A",
    });

    const tasks = response.data.values || [];
    const taskIndex = tasks.findIndex((item) => item[0] === task);

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Clear the cell with the deleted task
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!A${taskIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [[""]] },
    });
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
