import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ChartComponent from './Chart'; 

function Form() {
  const [startDate, setStartDate] = useState(moment().subtract(10, 'years').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/data?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      setError("Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(startDate, endDate);
  };

  return (
    <div>
      <h2>Patrimoine</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="startDate">De :</label>
          <input
            type="date"
            id="startDate"
            value={moment(startDate).format('YYYY-MM-DD')}
            onChange={(e) => setStartDate(e.target.value)}
            min={moment().subtract(30, 'years').format('YYYY-MM-DD')}
            max={moment().format('YYYY-MM-DD')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">A :</label>
          <input
            type="date"
            id="endDate"
            value={moment(endDate).format('YYYY-MM-DD')}
            onChange={(e) => setEndDate(e.target.value)}
            min={moment(startDate).format('YYYY-MM-DD')}
            max={moment().format('YYYY-MM-DD')}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" className="btn btn-primary">Afficher l'évolution</button>
      </form>

      {loading ? (
        <p>Chargement des données...</p>
      ) : chartData.length === 0 ? (
        <p>Aucune donnée disponible pour la période sélectionnée.</p>
      ) : (
        <ChartComponent data={chartData} />
      )}
    </div>
  );
}

export default Form;
