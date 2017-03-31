import {createPostObj} from '../utilities/appUtils';
import urls from '../utilities/allurls';

export const PENDING = 'PENDING';
export const FEED = 'FEED';
export const RESET = 'RESET';
export const ADDFOOD = 'ADDFOOD';
export const ADDINGFOOD = 'ADDINGFOOD';

const requestData = () => ({type: PENDING});
const resetData = () => ({type: RESET})
const addingFood = () => ({type: ADDINGFOOD});
const exportData = (type, data) => ({type, data});

async function loadSavedFeed(dispatch, user) {
  let savedData = await fetch(`${urls.mySavedFoods}/${user.fbid}`);
  savedData = await savedData.json();
  dispatch(exportData(FEED, []));
  if (!savedData || !savedData.length) return;
  dispatch(exportData(FEED, savedData));
}

function transformData(newData, liked, saved) {
  if (!newData.length) {
    return;
  }
  newData.forEach((value) => {
    value.userLiked = false;
    value.userSaved = false;
    value.home = true;
    let userLiked;
    let userSaved;

    if (liked) {
      userLiked = liked.filter(element => value.foodid === element);
    }

    if (saved) {
      userSaved = saved.filter(element => value.foodid === element);
    }

    if (userLiked && userLiked.length) {
      value.userLiked = true;
    }

    if (userSaved && userSaved.length) {
      value.userSaved = true;
    }
  });
}

async function loadNewFeed(dispatch, fbid) {
  let newData = await fetch(urls.feed);
  newData = await newData.json();
  let likedAndSavedData = await fetch(`${urls.profile}/${fbid}`);
  likedAndSavedData = await likedAndSavedData.json();

  const liked = likedAndSavedData.liked;
  const saved = likedAndSavedData.saved;
  newData = newData || [];
  transformData(newData, liked, saved);
  dispatch(exportData(FEED, newData));
}

async function updateCurrentFood(dispatch, data, fbid) {
  let newdata = await fetch(urls.addFood, createPostObj(data, 'PATCH'));
  newdata = await newdata.json();
  dispatch(exportData(ADDFOOD, {foodAdded: true}));
  loadNewFeed(dispatch, fbid);
  return newdata;
}

async function postFood(dispatch, data, image, feed, user) {
  const uriParts = image.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const formData = new FormData();
  formData.append('file', {
    uri: image,
    type: `image/${fileType}`,
    name: data.feedfbid
  });
  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  };

  let upload = await fetch(urls.upload, options);
  upload = await upload.json();
  data.foodpic = upload.result;

  let newdata = await fetch(urls.addFood, createPostObj(data));
  newdata = await newdata.json();
  newdata.fbid = user.fbid;
  newdata.home = true;
  newdata.feedfbid = user.fbid;
  newdata.name = user.name;
  newdata.picture = user.picture;
  newdata.userSaved = true;

  feed.data.unshift(newdata);

  dispatch(exportData(FEED, feed.data));
  return newdata;
}

export const resetFoodAdded = () => ((dispatch) => {
  dispatch(exportData(ADDFOOD, {foodAdded: false}));
});

export const likeFood = (foodid, fbid, state) => ((dispatch) => {
  fetch(`${urls.like}/${foodid}/${fbid}/${state}`);
});

export const saveFood = (foodid, fbid, state) => ((dispatch) => {
  fetch(`${urls.save}/${foodid}/${fbid}/${state}`);
});

export const addFood = (data, image) => ((dispatch, getState) => {
  dispatch(requestData());
  postFood(dispatch, data, image, getState().feed, getState().auth.user);
});

export const updateFood = (data) => ((dispatch, getState) => {
  dispatch(requestData());
  updateCurrentFood(dispatch, data, getState().auth.user.fbid);
});

export const getSavedFeed = () => ((dispatch, getState) => {
  dispatch(resetData());
  dispatch(requestData());
  return loadSavedFeed(dispatch, getState().auth.user);
});

export const getNewFeed = () => ((dispatch, getState) => {
  dispatch(resetData());
  dispatch(requestData());
  return loadNewFeed(dispatch, getState().auth.user.fbid);
});
