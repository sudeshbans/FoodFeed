import * as types from '../actions/auth';

const auth = (state = {}, action) => {
  switch (action.type) {
    case types.PENDING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.USERREADY:
      return Object.assign({}, state, {
        userReady: true,
        user: action.data.user
      });
    case types.LOGGEDIN:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.data.user
      });
    case types.LOGGEDOUT:
      return Object.assign({}, state, {
        isFetching: false,
        userReady: true,
        user: action.data.user
      });
    default:
      return state;
  }
};

export default auth;
