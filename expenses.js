const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        console.log("POST /expenses hit");
        console.log("Body received:", req.body);

        const { amount, category, description, date } = req.body;

        const result = await pool.query(
            `INSERT INTO expenses (amount, category, description, date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [amount, category, description, date]
        );

        console.log("Inserted:", result.rows[0]);
        res.json(result.rows[0]);

    } catch (err) {
        console.error("Insert error:", err);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM expenses ORDER BY id DESC"
        );
        res.json(result.rows);

    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
