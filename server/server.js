const express = require("express");
const mainRouter = require("./src/routes/index");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ Import cookie-parser
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ Enable CORS for all requests
app.use(
  cors({
    origin: "https://quicksum-ai-six.vercel.app", // ✅ Change this to your frontend's URL
    credentials: true, // ✅ Allow cookies and authentication headers
  })
);

app.use(express.json());
app.use(cookieParser()); // ✅ Enable parsing of cookies

app.get("/keep-me-alive", (req, res) => {
  res.status(200).send("I am alive yo");
});

app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
