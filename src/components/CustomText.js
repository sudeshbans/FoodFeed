import React from 'react';
import {
  Text
} from 'react-native';
import {
  Font
} from 'exponent';

class CustomText extends React.Component {
  render() {
    return (
      <Text {...this.props} style={[this.props.style, Font.style(this.props.name)]} />
    );
  }
}

export default CustomText;
