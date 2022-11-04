import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { saveGame } from '../store';

/**
 * COMPONENT
 */
export const Game = (props) => {
  const { username } = props;
  const colors = ['green', 'blue', 'purple', 'orange', 'pink', 'red', 'yellow'];

  // state
  const [gameOver, setGameOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [colorIndex, setColorIndex] = useState(-1);
  const [enableClick, setEnableClick] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [results, setResults] = useState([]);
  const [gameInfo, setGameInfo] = useState({});

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
      const reactionTime = Number(((clickTime - startTime) / 1000).toFixed(3));
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

  async function saveGameResults() {
    // on user click, gather the results into gameInfo object
    const bestTime = Math.min(...results);
    const avgTime = Number(
      (
        results.reduce((accum, val) => {
          return accum + val;
        }, 0) / results.length
      ).toFixed(3)
    );
    const gameInfo = {
      result: results,
      bestTime,
      avgTime,
    };

    setGameInfo(gameInfo);

    console.log('gameInfo: ', gameInfo);

    // try to save the game (in database)
    try {
      await props.saveGame(gameInfo);
      setSaved(true);
    } catch (error) {
      console.log('error saving the game at the moment. ', error);
    }
  }

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <main>
      <h1>Hi, {username}</h1>
      {gameOver && !saved && (
        <section>
          <h4>Game Completed!</h4>
          <p>Click save to see results or play again!</p>
        </section>
      )}
      {gameOver && saved && (
        <section id="result">
          <h4>~ Results ~</h4>
          <p id="bestTime">Best: {gameInfo.bestTime}s</p>
          <p id="avgTime">Average: {gameInfo.avgTime}s</p>
        </section>
      )}
      <div
        className={
          colorIndex === -1 || colorIndex >= colors.length
            ? 'box grey'
            : `box ${colors[colorIndex]}`
        }
        onClick={handleClick}
      ></div>
      <button type="button" className="all-btns" onClick={() => history.go(0)}>
        Restart
      </button>
      <br />
      {gameOver && !saved && (
        <button type="button" className="all-btns" onClick={saveGameResults}>
          Save Results
        </button>
      )}
    </main>
  );
};

const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

const mapDispatch = (dispatch) => {
  return {
    saveGame: (gameInfo) => dispatch(saveGame(gameInfo)),
  };
};

export default connect(mapState, mapDispatch)(Game);
