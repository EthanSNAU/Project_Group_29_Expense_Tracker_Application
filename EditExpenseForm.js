import React, { useState, useEffect } from "react";

const CATEGORIES = [
  "Food", 
  "Housing", 
  "Transportation", 
  "Utilities", 
  "Entertainment", 
  "Personal Care",
  "Miscellaneous"
];

// setting up form
export default function EditExpenseForm({ expense, onSave, onCancel }) {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description || "");
  const [date, setDate] = useState(expense.date.split('T')[0]);

  // setting up use effect
  useEffect(() => {
    setAmount(expense.amount);
    setCategory(expense.category);
    setDescription(expense.description || "");
    setDate(expense.date.split('T')[0]);
  }, [expense]);

  //handling submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedExpense = {
      amount,
      category,
      description,
      date,
    };

    // for fetching asynchronously
    const response = await fetch(`http://localhost:5000/expenses/${expense.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    });

    if (response.ok) {
      onSave();
    } else {
      console.error("Failed to update expense:", response.statusText);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
      <h3>Edit Expense (ID: {expense.id})</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      /><br/>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
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
        required
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
      
      <button type="submit" style={{ background: 'white', color: 'black', marginRight: '10px' }}>Save Changes</button>
      <button type="button" onClick={onCancel} style={{ background: 'white', color: 'black' }}>Cancel Edit</button>
    </form>
  );
}