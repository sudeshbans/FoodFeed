import {
  createRouter
} from '@exponent/ex-navigation';
import Home from '../components/Home';
import ImagePicker from '../components/ImagePicker';

const Router = createRouter(() => ({
  home: () => Home,
  imagePicker: () => ImagePicker
}));

export default Router;
