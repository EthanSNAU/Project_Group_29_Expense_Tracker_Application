const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const expensesRoute = require("./routes/expenses");

// Use routes
app.use("/expenses", require("./routes/expenses"));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
