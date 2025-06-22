import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/openai", (req, res) => {
  res.json({ reply: `You said: ${req.body.prompt}` });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));
