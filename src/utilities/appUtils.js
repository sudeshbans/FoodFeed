import { Alert } from 'react-native';
import { bindActionCreators } from 'redux'
import * as authActionCreators from '../actions/auth';

const ANON_USER = '1-anon_user';

function debounce(func, wait, immediate) {
  let timeout;
  return function anon(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
}

const LaunchLoginAlert = (displayString, action) => {
  Alert.alert(
    displayString,
    'Use your social-media creadentials to log-in',
    [
      {text: 'Login', onPress: () => action()},
      {text: 'Later'}
    ]
  );
};

const LaunchDeleteAlert = (displayString, action) => {
  Alert.alert(
    displayString,
    '',
    [
      {text: 'Yes', onPress: () => action()},
      {text: 'Cancel'}
    ]
  );
};


function createPostObj(data, type) {
  console.log(type, 'in post obj');
  return {
    method: type || 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
}

function userCanPost(userName) {
  return userName !== ANON_USER;
}

export {
  debounce,
  LaunchLoginAlert,
  LaunchDeleteAlert,
  ANON_USER,
  userCanPost,
  createPostObj
};
