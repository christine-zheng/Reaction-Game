import axios from 'axios';

// will be used to access the token in window's local storage
const TOKEN = 'token';

// action types
const GET_STATS = 'GET_STATS';
const ADD_RESULTS = 'ADD_RESULTS';

// action creators
const getStats = (stats) => ({
  type: GET_STATS,
  stats,
});

const addResults = (gameResults) => ({
  type: ADD_RESULTS,
  gameResults,
});

// thunk creators
export const fetchStats = () => {
  return async (dispatch) => {
    try {
      const userToken = window.localStorage.getItem(TOKEN);

      // if token exists for user
      if (userToken) {
        const { data } = await axios.get('/api/games/userStats', {
          headers: {
            authorization: userToken,
          },
        });
        dispatch(getStats(data));
      }
    } catch (error) {
      console.log('Sorry, unable to fetch the user stats currently. ', error);
      throw error;
    }
  };
};

export const saveGame = (gameInfo) => {
  return async (dispatch) => {
    try {
      const userToken = window.localStorage.getItem(TOKEN);

      // if token exists for user
      if (userToken) {
        const { data } = await axios.post('/api/games/userStats', gameInfo, {
          headers: {
            authorization: userToken,
          },
        });
        dispatch(addResults(data));
      }
    } catch (error) {
      console.log(
        'Sorry, unable to save the game results at the moment. ',
        error
      );
      throw error;
    }
  };
};

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_STATS:
      return action.stats;
    case ADD_RESULTS:
      return [...state, action.gameResults];
    default:
      return state;
  }
}
