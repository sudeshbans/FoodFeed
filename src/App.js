import Exponent from 'exponent';
import {Provider} from 'react-redux';
import React from 'react';
import configureStore from './configure-store';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import ValidateAuth from './navigation/ValidateAuth';

const store = configureStore();

class App extends React.Component {
  state = {
    appIsReady: false
  }

  componentWillMount() {
    this.loadAssetsAsync();
  }

  async loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: []
      });
    } catch (e) {
      console.warn(`There was an error caching assets (see: main.js),
      perhaps due to a network timeout, so we skipped caching.
      Reload the app to try again.`);
    } finally {
      this.setState({appIsReady: true});
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={store}>
          <ValidateAuth />
        </Provider>
      );
    }

    return <Exponent.Components.AppLoading />;
  }
}

export default App;
