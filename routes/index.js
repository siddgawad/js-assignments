
const express = require("express");
const app = express();
const userRoutes = require("./user"); // Adjust path if needed

app.use(express.json());
app.use("/user", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
