import axios from 'axios';

// will be used to access the token in window's local storage
const TOKEN = 'token';

// action types
const GET_LEADERBOARD = 'GET_LEADERBOARD';

// action creators
const getLeaderboard = (leaderboard) => ({
  type: GET_LEADERBOARD,
  leaderboard,
});

// thunk creators
export const fetchLeaderboard = () => {
  return async (dispatch) => {
    try {
      const userToken = window.localStorage.getItem(TOKEN);

      // if token exists for user
      if (userToken) {
        const { data } = await axios.get('/api/games/leaderboard', {
          headers: {
            authorization: userToken,
          },
        });
        dispatch(getLeaderboard(data));
      }
    } catch (error) {
      console.log('Sorry, unable to get the Leaderboard currently. ', error);
      throw error;
    }
  };
};

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_LEADERBOARD:
      return action.leaderboard;
    default:
      return state;
  }
}
