import React, { useState, useEffect } from 'react';
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
import { fetchStats } from '../store';

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
        color: 'white',
      },
      ticks: {
        color: 'white',
      },
      grid: {
        borderColor: 'white',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Reaction (seconds)',
        color: 'white',
      },
      ticks: {
        color: 'white',
      },
      grid: {
        borderColor: 'white',
      },
    },
  },
};

const labels = ['1', '2', '3', '4', '5', '6', '7'];

/**
 * COMPONENT
 */
export const Stats = (props) => {
  const { username, stats } = props;

  useEffect(() => {
    props.fetchStats();
  }, []);

  function chartData(results) {
    const data = {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'reaction time',
          borderColor: 'rgb(249, 137, 96)',
          borderWidth: 2,
          fill: false,
          data: results,
        },
        {
          type: 'bar',
          label: 'reaction time',
          backgroundColor: 'rgb(179, 230, 233)',
          data: results,
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    };
    return data;
  }

  if (stats.length === 0) {
    return (
      <main>
        <h1>{username.toUpperCase()} STATS</h1>
        <p>No stats to show yet. Play a game!</p>
      </main>
    );
  } else {
    return (
      <main>
        <h1 id="stats-heading">{username.toUpperCase()} STATS</h1>
        {stats.map((info, index) => {
          return (
            <div key={info.id} className="stats">
              <p id="best">Best: {info.bestTime}s</p>
              <p id="avg">Average: {info.avgTime}s</p>
              <Chart
                type="bar"
                options={options}
                data={chartData(info.result)}
              />
            </div>
          );
        })}
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
    stats: state.stats,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchStats: () => dispatch(fetchStats()),
  };
};

export default connect(mapState, mapDispatch)(Stats);
