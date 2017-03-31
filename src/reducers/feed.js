import * as types from '../actions/feed';

const auth = (state = {}, action) => {
  console.log(action);
  switch (action.type) {
    case types.PENDING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RESET:
      return Object.assign({}, state, {
        isFetching: false,
        data: []
      });
    case types.FEED:
      return Object.assign({}, state, {
        isFetching: false,
        data: [].concat(action.data)
      });
    default:
      return state;
  }
};

export default auth;
