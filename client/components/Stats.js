import React, { useState } from 'react';
import { connect } from 'react-redux';

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
