import Exponent from 'exponent';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Navigation from './Navigation';
import Login from '../components/Login';
import * as authActionCreators from '../actions/auth';

class ValidateAuth extends Component {

  componentWillMount() {
    if (this.props.logout) {
      this.props.actions.logout();
    } else {
      this.props.actions.userReady();
    }
  }

  render() {
    const {actions, userReady, user} = this.props;
    if (userReady) {
      if (user) {
        return <Navigation actions={actions} user={user} />;
      }
      return <Login actions={actions} />;
    }

    return <Exponent.Components.AppLoading />;
  }
}

const mapStateToProps = (state) => {
  const {userReady, user} = state.auth;
  return {
    userReady,
    user
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ValidateAuth);
