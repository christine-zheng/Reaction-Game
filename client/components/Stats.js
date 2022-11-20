import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchStats } from '../store';
import Leaderboard from './Leaderboard';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

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

// tabs for Framer Motion animation
const allStats = [
  { icon: '📈', label: 'My Stats' },
  { icon: '🏆', label: 'Leaderboard' },
];

const [myStats, leaderboard] = allStats;
const tabs = [myStats, leaderboard];

/**
 * COMPONENT
 */
export const Stats = (props) => {
  const { stats } = props;
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

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

  return (
    <main>
      <div className="window">
        <nav>
          <ul>
            {tabs.map((item) => (
              <li
                key={item.label}
                className={item === selectedTab ? 'selected' : ''}
                onClick={() => setSelectedTab(item)}
              >
                {`${item.icon} ${item.label}`}
                {item === selectedTab ? (
                  <motion.div className="underline" layoutId="underline" />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <section>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              layoutScroll
              style={{ overflow: 'auto' }}
              key={selectedTab ? selectedTab.label : 'empty'}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              id="framer-layout"
            >
              {selectedTab.label === 'My Stats' && stats.length === 0 && (
                <p>No stats to show yet. Play a game!</p>
              )}
              {selectedTab.label === 'My Stats' &&
                stats.length > 0 &&
                stats.map((info, index) => {
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
              {selectedTab.label === 'Leaderboard' && <Leaderboard />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    stats: state.stats,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchStats: () => dispatch(fetchStats()),
  };
};

export default connect(mapState, mapDispatch)(Stats);
