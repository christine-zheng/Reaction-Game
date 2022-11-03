import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import history from '../history';

/**
 * COMPONENT
 */
export const Game = (props) => {
  const { username } = props;
  const colors = ['green', 'blue', 'purple', 'orange', 'pink', 'red', 'yellow'];

  // state
  const [gameOver, setGameOver] = useState(false);
  const [colorIndex, setColorIndex] = useState(-1);
  const [enableClick, setEnableClick] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [results, setResults] = useState([]);

  // track reference to colorIndex
  const colorIndexRef = useRef(colorIndex);
  colorIndexRef.current = colorIndex;

  // generate a wait time between 450 - 1500 ms
  function generateWaitTime() {
    const timeInMs = Math.random() * (1500 - 450) + 450;
    return timeInMs;
  }

  // when component is mounted, timer to initiate game
  useEffect(() => {
    const timer = setTimeout(() => {
      setColorIndex(colorIndexRef.current + 1);
      setEnableClick(true);

      // once the color changes, set the start time
      const time = new Date();
      setStartTime(time);
    }, generateWaitTime());
    return () => clearTimeout(timer);
  }, []);

  // timeRef for during gameplay
  const timerRef = useRef(null);
  function handleClick(e) {
    e.preventDefault();
    const clickTime = new Date();

    // if not game over and click is enabled
    if (!gameOver && enableClick) {
      // calculate reaction time
      const reactionTime = (clickTime - startTime) / 1000;
      setResults([...results, reactionTime]);

      console.log('reaction time in seconds: ', reactionTime);
      setEnableClick(false);

      // call setTimeout on user click/interaction
      timerRef.current = setTimeout(() => {
        setColorIndex(colorIndexRef.current + 1);
        setEnableClick(true);

        // once the color changes, set the start time
        const time = new Date();
        setStartTime(time);
      }, generateWaitTime());
      console.log('i was clicked. color index: ', colorIndex);
      if (colorIndex === colors.length - 1) {
        setGameOver(true);
      }
    }
  }

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <main>
      <h3>Hi, {username}</h3>
      <div
        className={
          colorIndex === -1 || colorIndex >= colors.length
            ? 'box grey'
            : `box ${colors[colorIndex]}`
        }
        onClick={handleClick}
      ></div>
      <p>{results}</p>
      <button type="button" onClick={() => history.go(0)}>
        Restart
      </button>
      {gameOver && (
        <Link to="/stats">
          <button type="button">See Results!</button>
        </Link>
      )}
    </main>
  );
};

const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Game);
