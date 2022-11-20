import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchLeaderboard } from '../store';

/**
 * COMPONENT
 */
export const Leaderboard = (props) => {
  const { leaderboard } = props;

  useEffect(() => {
    props.fetchLeaderboard();
  }, []);

  return (
    <div id="leaderboard">
      {leaderboard.length > 0 &&
        leaderboard.map((info, index) => {
          return (
            <div key={info.id} className="leaderboard-item">
              <div className="item-rank">#{index + 1}</div>
              <div className="item-user">{info.user.username}</div>
              <div className="item-avgTime">{info.avgTime}s</div>
            </div>
          );
        })}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    leaderboard: state.leaderboard,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchLeaderboard: () => dispatch(fetchLeaderboard()),
  };
};

export default connect(mapState, mapDispatch)(Leaderboard);
