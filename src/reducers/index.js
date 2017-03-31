import { combineReducers } from 'redux';
import auth from './auth';
import feed from './feed';

const rootReducer = combineReducers({
  auth,
  feed
});

export default rootReducer;
