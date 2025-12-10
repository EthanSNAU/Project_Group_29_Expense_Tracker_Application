import React, { useState, useEffect } from 'react';

export default function RecommendationsDisplay() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchRecommendations = async () => {
    setLoading(true);
    setRecommendations([]);

    try {
      const url = `http://localhost:5000/expenses/recommendations?year=${selectedYear}&month=${selectedMonth}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch recommendations (Status: ${res.status})`);
      }

      const data = await res.json();
      setRecommendations(data);

    } catch (err) {
      console.error(err);
      setRecommendations(["Could not load recommendations due to a server error."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedMonth, selectedYear]);

  return (
    <div style={{ border: '1px solid #ebebeb', padding: '20px', margin: '20px 0', background: '#ebebeb' }}>
      <h3>Spending Recommendations</h3>
      
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

      {loading ? (
        <p>Analyzing spending patterns...</p>
      ) : (
        <ul style={{ paddingLeft: '20px' }}>
          {recommendations.map((rec, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {rec}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}