import {
  Asset,
  Font
} from 'exponent';

function cacheImages(images) {
  return images.map(image => Asset.fromModule(image).downloadAsync());
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default function cacheAssetsAsync({images = [], fonts = []}) {
  return Promise.all([
    ...cacheImages(images),
    ...cacheFonts(fonts)
  ]);
}
