import {StatusBar} from 'react-native';
import {NavigationProvider, StackNavigation} from '@exponent/ex-navigation';
import React from 'react';
import Router from './Router';

const Navigation = ({actions, user}) => (
  <NavigationProvider router={Router}>
    <StatusBar barStyle="light-content" />
    <StackNavigation
      initialRoute={Router.getRoute('home')} />
  </NavigationProvider>
);

export default Navigation;
