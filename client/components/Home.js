import React, { useState } from 'react';
import { connect } from 'react-redux';
import Game from './Game';

// import for react-anime
import Anime from '@mollycule/react-anime';

/**
 * COMPONENT
 */
export const Home = (props) => {
  const [game, setGame] = useState(false);
  const { username } = props;

  if (!game) {
    return (
      <main>
        <h1>Welcome, {username}</h1>
        <p>Play to see your reaction time!</p>
        <p>Click on the box when you see the color changes.</p>
        <button
          type="button"
          id="start-btn"
          className="all-btns"
          onClick={() => setGame(true)}
        >
          Start Game!
        </button>
      </main>
    );
  }
  return <Game />;
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
