import {AsyncStorage} from 'react-native';
import Exponent from 'exponent';
import {createPostObj, ANON_USER} from '../utilities/appUtils';
import urls from '../utilities/allurls';

export const LOGGEDIN = 'LOGGEDIN';
export const LOGGEDOUT = 'LOGGEDOUT';
export const USERREADY = 'USERREADY';
export const PENDING = 'PENDING';

const requestData = () => ({type: PENDING});
const exportData = (type, data) => ({type, data});


async function fbLogin(dispatch) {
  const { type, token } = await Exponent.Facebook.logInWithReadPermissionsAsync(
    urls.fbAppID, {
      permissions: ['public_profile']
    });

  if (type === 'success') {
    const response = await fetch(`${urls.fbLogin}${token}`);
    const fbData = await response.json();

    if (fbData.name === 'Foods Feeds') {
      fbData.name = 'Food Feed';
    }

    const options = {
      name: fbData.name,
      fbid: fbData.id,
      picture: fbData.picture.data.is_silhouette ? false : fbData.picture.data.url
    };
    const createProfile = await fetch(urls.createProfile, createPostObj(options));
    const profileCreated = await createProfile.json();
    if (profileCreated.result === 'ok') {
      await AsyncStorage.setItem(urls.profileString, JSON.stringify(options));
      dispatch(exportData(LOGGEDIN, {user: options}));
    } else {
      console.log('failed');
    }
  }
}

async function isUserReady(dispatch) {
  let profile = await AsyncStorage.getItem(urls.profileString);
  profile = profile ? JSON.parse(profile) : null;
  dispatch(exportData(USERREADY, {user: profile, userReady: true}));
}

export const userReady = () => ((dispatch) => {
  dispatch(requestData());
  isUserReady(dispatch);
});

async function isAnonUserReady(dispatch) {
  const user = {
    name: ANON_USER
  };
  await AsyncStorage.setItem(urls.profileString, JSON.stringify(user));
  isUserReady(dispatch);
}


export const socailLogin = () => ((dispatch) => {
  dispatch(requestData());
  return fbLogin(dispatch);
});

export const proceedWithoutLogin = () => ((dispatch) => {
  dispatch(requestData());
  isAnonUserReady(dispatch);
});

export const logout = () => ((dispatch) => {
  AsyncStorage.removeItem((urls.profileString), () => {
    dispatch(exportData(LOGGEDOUT, {user: null, userReady: true}));
  });
});
