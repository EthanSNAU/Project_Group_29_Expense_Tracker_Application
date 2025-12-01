import React, { useState, useEffect } from 'react';

export default function AnalyticsDisplay() {
  // Set default to the current month/year 
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0')); // 01-12
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Array of months for the dropdown
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];


  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    setAnalyticsData(null);

    try {
      const url = `http://localhost:5000/expenses/analytics?year=${selectedYear}&month=${selectedMonth}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch analytics (Status: ${res.status})`);
      }

      const data = await res.json();
      setAnalyticsData(data);

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth, selectedYear]);


  const renderContent = () => {
    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!analyticsData || analyticsData.totalSpending === "0.00") {
      return <p>No expense data found for the selected month.</p>;
    }

    return (
      <div>
        <h4>Summary for {monthNames[parseInt(selectedMonth, 10) - 1]} {selectedYear}</h4>
        <p><strong>Total Spending:</strong> ${analyticsData.totalSpending}</p>
        <p><strong>Avg. Daily Expenditure:</strong> ${analyticsData.averageDailyExpenditure}</p>
        
        <h5>Category Breakdown:</h5>
        <ul>
          {analyticsData.categoryBreakdown.map((item, index) => (
            <li key={index}>
              {item.category}: ${item.total}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', margin: '20px 0', background: '#f9f9f9' }}>
      <h3>Analytics</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {monthNames.map((name, index) => (
            <option key={index + 1} value={String(index + 1).padStart(2, '0')}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          min="2000"
          max={String(now.getFullYear() + 1)}
          style={{ width: '80px' }}
        />
      </div>
      
      {renderContent()}
    </div>
  );
}