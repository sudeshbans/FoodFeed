import React from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  TouchableOpacity,
  View
} from 'react-native';
import {SimpleLineIcons} from '@exponent/vector-icons';
import CustomText from './CustomText';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2e456b',
    alignItems: 'center',
    opacity: 0.9
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain' // or 'stretch'
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0ecff',
    opacity: 1,
    padding: 10
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eaf2ff',
    textAlign: 'center'
  },
  skiplogin: {
    fontSize: 15,
    paddingTop: 10,
    textDecorationStyle: 'solid',
    color: '#edf6ff',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  icon: {
    color: '#2673ef'
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0) // init opacity 0
    };
  }

  componentDidMount() {
    Animated.timing(
     this.state.fadeAnim,
      {
        toValue: 1,
        duration: 600,
        easing: Easing.linear
      }
    ).start();
  }

  render() {
    const {actions} = this.props;
    return (
      <Animated.View style={[styles.container, {opacity: this.state.fadeAnim}]}>
        {
          /*
            <Image
              source={{uri: 'http://192.168.0.110:6464/cover.jpg'}}
              style={[styles.container, styles.backgroundImage]}>
          */
        }
        <TouchableOpacity onPress={actions.socailLogin}>
          <View style={styles.button}>
            <CustomText style={[styles.text]}>
              <SimpleLineIcons
                style={styles.icon}
                name="social-facebook"
                size={20} />
              <CustomText>{' '}</CustomText>
                Login with facebook
            </CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={actions.proceedWithoutLogin}>
          <CustomText style={[styles.skiplogin]}>skip login for now</CustomText>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default Login;
