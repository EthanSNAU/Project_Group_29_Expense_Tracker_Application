import React, { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpenseForm from "./components/EditExpenseForm";
import AnalyticsDisplay from "./components/AnalyticsDisplay";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null); 

  // for refreshing
  const handleRefresh = () => {
    setRefresh(!refresh);
    setEditingExpense(null); 
  };

  // handles editing
  const handleEdit = (expenseToEdit) => {
    setEditingExpense(expenseToEdit);
  };

  //handles canceling
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // decided to show editing or add form
  const renderForm = () => {
    if (editingExpense) {
      // If editing mode, show the Edit form
      return (
        <EditExpenseForm 
          expense={editingExpense} 
          onSave={handleRefresh}
          onCancel={handleCancelEdit} 
        />
      );
    } else {
      // shows add if editing is not active
      return <ExpenseForm onAdd={handleRefresh} />;
    }
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <AnalyticsDisplay />
      
      {renderForm()}
      
      <ExpenseList 
        refresh={refresh} 
        onEdit={handleEdit} 
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default App;
