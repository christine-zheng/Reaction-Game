import React from 'react';
import { connect } from 'react-redux';
// import { withRouter, Routes, Route } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import { getUserByToken } from './store';

/**
 * COMPONENT
 */
class AppRoutes extends React.Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Navigate replace to="/home" />} />
            <Route path="/signup" element={<Navigate replace to="/home" />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Navigate replace to="/" />} />
          </Routes>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(getUserByToken());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
// export default withRouter(connect(mapState, mapDispatch)(AppRoutes));
export default connect(mapState, mapDispatch)(AppRoutes);
