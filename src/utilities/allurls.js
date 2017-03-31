const root = '';
const FB_URL = '';
const APPID = '';

function createUrl(path) {
  return `${root}/${path}`;
}

const urls = {
  createProfile: createUrl('profile'),
  feed: createUrl('feed'),
  like: createUrl('like'),
  save: createUrl('save'),
  mySavedFoods: createUrl('saved'),
  profile: createUrl('profile'),
  addFood: createUrl('feed'),
  upload: createUrl('upload'),
  fbLogin: FB_URL,
  fbAppID: APPID,
  profileString: '4FB0E683-1511-4AFF-B70E-AF2BED49E1F3'
};

export default urls;
