import axios from 'axios';
import history from '../history';

// will be used to access the token in window's local storage
const TOKEN = 'token';

// action types
const SET_AUTH = 'SET_AUTH';

// action creators
// auth can be empty, an authorized user, or an authentication error
const setAuth = (auth) => ({
  type: SET_AUTH,
  auth,
});

// thunk creators
export const getUserByToken = () => {
  return async (dispatch) => {
    // if authenticateUser was successful, window's storage should have token now. get this token
    const userToken = window.localStorage.getItem(TOKEN);

    // if token exists for user
    if (userToken) {
      const { data } = await axios.get('/auth/user', {
        headers: {
          authorization: userToken,
        },
      });
      history.replace('/home');
      return dispatch(setAuth(data));
    }
  };
};

// method: login or signup
export const authenticateUser = (username, password, method) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`/auth/${method}`, {
        username,
        password,
      });

      // if login/signup was successful, set the user's token in window's local storage
      window.localStorage.setItem(TOKEN, data.token);

      dispatch(getUserByToken());
    } catch (authenticationError) {
      dispatch(setAuth({ error: authenticationError }));
    }
  };
};

// logout the user
export const logout = () => {
  // remove token from window's local storage & redirect to /login
  window.localStorage.removeItem(TOKEN);
  history.push('/login');
  return setAuth({});
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
