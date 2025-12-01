const express = require("express");
const router = express.Router();
const pool = require("../db");

// for insertion
router.post("/", async (req, res) => {
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
});

// for fetching
router.get("/", async (req, res) => {
    try {
        const { sortBy = 'date', sortDir = 'DESC' } = req.query;

        const validColumns = ['date', 'category', 'amount'];
        const validDirections = ['ASC', 'DESC'];

        const column = validColumns.includes(sortBy.toLowerCase()) ? sortBy : 'date';
        const direction = validDirections.includes(sortDir.toUpperCase()) ? sortDir : 'DESC';

        const orderByClause = column === 'amount' 
            ? `(amount::numeric)` 
            : column;

        const queryText = `SELECT * FROM expenses ORDER BY ${orderByClause} ${direction}`;
        
        console.log("Executing query:", queryText);

        const result = await pool.query(queryText);
        res.json(result.rows);

    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).send("Server error");
    }
});

// for deletion
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    await pool.query(
        "DELETE FROM expenses WHERE id = $1",
        [id]
    );

    console.log(`Deleted expense with ID: ${id}`);
    res.json("Expense deleted successfully");
});

// for editing
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({ error: "Missing required fields for update." });
    }

    const result = await pool.query(
        `UPDATE expenses 
             SET amount = $1, category = $2, description = $3, date = $4 
             WHERE id = $5 
             RETURNING *`, 
        [amount, category, description, date, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Expense not found." });
    }

    console.log("Updated Expense:", result.rows[0]);
    res.json(result.rows[0]);
});

// for analytics
router.get("/analytics", async (req, res) => {
    try {
        const { year, month } = req.query; 

        if (!year || !month) {
            return res.status(400).json({ error: "Missing year and month parameters (e.g., ?year=2025&month=11)." });
        }
        
        const totalQuery = `
            SELECT 
                category,
                SUM(amount::numeric) AS category_total
            FROM expenses
            WHERE 
                EXTRACT(YEAR FROM date::date) = $1 AND 
                EXTRACT(MONTH FROM date::date) = $2
            GROUP BY category
            ORDER BY category_total DESC;
        `;
        const totalResult = await pool.query(totalQuery, [year, month]);
        const breakdown = totalResult.rows;
        
        const totalSpending = breakdown.reduce((sum, row) => sum + parseFloat(row.category_total), 0);
        
        const uniqueDaysQuery = `
            SELECT COUNT(DISTINCT date::date) AS unique_days_count
            FROM expenses
            WHERE 
                EXTRACT(YEAR FROM date::date) = $1 AND 
                EXTRACT(MONTH FROM date::date) = $2;
        `;
        const daysResult = await pool.query(uniqueDaysQuery, [year, month]);
        const uniqueDays = parseInt(daysResult.rows[0].unique_days_count, 10);
        
        let averageDailyExpenditure = 0;
        if (uniqueDays > 0 && totalSpending > 0) {
             averageDailyExpenditure = totalSpending / uniqueDays; 
        }

        res.json({
            totalSpending: totalSpending.toFixed(2),
            averageDailyExpenditure: averageDailyExpenditure.toFixed(2),
            categoryBreakdown: breakdown.map(row => ({
                 category: row.category,
                 total: parseFloat(row.category_total).toFixed(2)
            }))
        });

    } catch (err) {
        console.error("Analytics fetch error:", err);
        res.status(500).send("Server error during analytics fetch.");
    }
});

module.exports = router;