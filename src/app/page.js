"use client"
import React, { useState } from 'react';
import Chart from './components/Chart';
import moment from 'moment';

function App() {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'years').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: 'Patrimoine',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

  const generateFakeData = (start, end) => {
    const currentDate = new Date();
    const startYear = parseInt(start.split('-')[0]);
    const endYear = parseInt(end.split('-')[0]);
    
    const months = Utils.months({count: 7});
    const data = [];
    
    for (let year = startYear; year <= endYear; year++) {
      const monthIndex = Math.floor(Math.random() * months.length);
      const value = Math.floor(Math.random() * 1000000 + 700000);
      
      data.push({
        month: months[monthIndex],
        value
      });
    }

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setData({
        labels: [],
        datasets: [{
          label: 'Patrimoine',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });

      const fakeData = await generateFakeData(startDate, endDate);
      
      const apiResponse = await fetch('/api/fake-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });
      
      const responseData = await apiResponse.json();
      
      setData({
        labels: responseData.labels,
        datasets: [{
          label: 'Patrimoine',
          data: responseData.data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });
    } catch (error) {
      console.error("Une erreur est survenue:", error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="startDate">De :</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={moment().subtract(30, 'years').format('YYYY-MM-DD')}
          max={moment().format('YYYY-MM-DD')}
        />
        
        <label htmlFor="endDate">À :</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={moment(startDate).format('YYYY-MM-DD')}
          max={moment().format('YYYY-MM-DD')}
        />
        
        <button type="submit" className="btn btn-primary">Afficher l'évolution</button>
      </form>

      {data.datasets[0].data.length > 0 ? (
        <Chart data={data}/>
      ) : (
        <p>L'évolution de votre patrimoine</p>
      )}
    </div>
  );
}

export default App;
