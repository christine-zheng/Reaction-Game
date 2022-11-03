import React, { useState } from 'react';
import { connect } from 'react-redux';

// imports for Chart.js
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Attempts',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Reaction Time (seconds)',
      },
    },
  },
};

const labels = ['1', '2', '3', '4', '5', '6', '7'];

const dummyData = [0.339, 0.344, 0.319, 0.457, 0.486, 0.332, 0.423];

export const data = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'reaction time',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      data: dummyData,
    },
    {
      type: 'bar',
      label: 'reaction time',
      backgroundColor: 'rgb(75, 192, 192)',
      data: dummyData,
      borderColor: 'white',
      borderWidth: 2,
    },
  ],
};

/**
 * COMPONENT
 */
export const Stats = (props) => {
  const [game, setGame] = useState(false);
  const { username } = props;

  if (!game) {
    return (
      <main>
        <h1>{username.toUpperCase()} STATS</h1>
        <Chart type="bar" options={options} data={data} />
      </main>
    );
  }
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Stats);
