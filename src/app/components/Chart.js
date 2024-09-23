import React from 'react';
import { Line } from 'react-chartjs-2';

function ChartComponent({ data }) {
  const labels = data.map(item => item.date);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Valeur du patrimoine',
        data: data.map(item => item.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }}
      />
    </div>
  );
}

export default ChartComponent;
