import React, { useEffect, useState } from 'react';

export default function ExpenseList({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, [refresh]);

  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            ${exp.amount} – {exp.category} – {exp.description} – {exp.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
