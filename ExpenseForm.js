import React, { useState } from "react";

const CATEGORIES = [
  "Food", 
  "Housing", 
  "Transportation", 
  "Utilities", 
  "Entertainment", 
  "Personal Care",
  "Miscellaneous"
];

export default function ExpenseForm({ onAdd }) {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        category,
        description,
        date
      }),
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");

    if (onAdd) onAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Expense</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br/>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      /><br/>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br/>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      /><br/>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
      <option value="" disabled>Select Category</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
      </select><br/>

      <button type="submit">Add Expense</button>
    </form>
  );
}
