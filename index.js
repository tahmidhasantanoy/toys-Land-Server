const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); //cors policy
app.use(express.json()); //middleware

app.get("/", (req, res) => {
  res.send("toys is creating");
});

app.listen(port, () => {
  console.log(`Toys are at ${port}`);
});
