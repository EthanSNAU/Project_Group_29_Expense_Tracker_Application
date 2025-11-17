import React, { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <ExpenseForm onAdd={handleRefresh} />
      <ExpenseList refresh={refresh} />
    </div>
  );
}

export default App;



