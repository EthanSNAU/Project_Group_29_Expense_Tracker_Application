import React, { useEffect, useState } from 'react';

// accepts edit and refresh
export default function ExpenseList({ refresh, onEdit, onRefresh }) { 
  const [expenses, setExpenses] = useState([]);
  
  // consts for sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('DESC');

  // For fetching
  const fetchExpenses = async () => {
    try {
      const url = `http://localhost:5000/expenses?sortBy=${sortBy}&sortDir=${sortDir}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setExpenses([]); 
    }
  };
  
  // Delete Function
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/expenses/${id}`, {
        method: "DELETE",
      });
      if (onRefresh) onRefresh(); 
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  // for changing the sorting order
  const handleSortChange = (e) => {
    const [newSortBy, newSortDir] = e.target.value.split(':');
    setSortBy(newSortBy);
    setSortDir(newSortDir);
  };

  // for refreshing
  useEffect(() => {
    fetchExpenses();
  }, [refresh, sortBy, sortDir]); 

  return (
    <div>
      <h2>Expenses</h2>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="sort-select">Sort By: </label>
        <select id="sort-select" onChange={handleSortChange} value={`${sortBy}:${sortDir}`}>
          <option value="date:DESC">Date (Newest First)</option>
          <option value="date:ASC">Date (Oldest First)</option>
          <option value="amount:DESC">Amount (Highest First)</option>
          <option value="amount:ASC">Amount (Lowest First)</option>
          <option value="category:ASC">Category (A-Z)</option>
          <option value="category:DESC">Category (Z-A)</option>
        </select>
      </div>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            ${exp.amount} – {exp.category} – {exp.description} – {exp.date.split('T')[0]}
            
            <button 
              onClick={() => onEdit(exp)} 
              style={{ marginLeft: '10px', background: 'white', color: 'black' }}>
              Edit
            </button>
            
            <button 
              onClick={() => handleDelete(exp.id)} 
              style={{ marginLeft: '10px', background: 'white', color: 'black' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}