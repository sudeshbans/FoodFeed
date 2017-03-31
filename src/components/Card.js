import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FontAwesome, Entypo} from '@exponent/vector-icons';
import {userCanPost, LaunchLoginAlert} from '../utilities/appUtils';
import CustomText from './CustomText';
import * as feedActionCreators from '../actions/feed';
import * as authActionCreators from '../actions/auth';

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  header: {
    flexDirection: 'row'
  },
  title: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    color: '#566377'
  },
  hashtags: {
    color: '#287aff',
    marginLeft: 35,
    marginBottom: 10
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around'
  },
  icons: {
    alignItems: 'stretch',
    color: '#566377'
  },
  selectedIcon: {
    color: '#287aff'
  },
  iconsText: {
    fontSize: 14,
    paddingLeft: 5,
    color: '#566377'
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#566377',
    marginTop: 10,
    opacity: 0.2
  },
  thumbnail: {
    height: 30,
    borderRadius: 15,
    width: 30
  },
  imageContainer: {
    borderColor: '#566377',
    borderRadius: 10,
    borderWidth: 0.3,
    opacity: 0.9,
    padding: 5
  },
  imageStyles: {
    flex: 1,
    borderRadius: 10,
    height: 220,
    width: null,
    resizeMode: 'cover'
  }
});

const modifyTags = (tags) => {
  return tags.map(data => `#${data}`);
};

const ProperSavedIcon = ({value}) => {
  if (!value) {
    return (
      <FontAwesome
        name="save"
        style={[styles.icons]}
        size={15} />
    );
  }
  return (
    <Entypo
      name="save"
      style={[styles.icons]}
      size={15} />
  );
};

const ProperLikedIcon = ({value}) => {
  if (value) {
    return (
      <FontAwesome
        name={'heart'}
        style={[styles.icons]}
        size={15} />
    );
  }
  return (
    <FontAwesome
      name={'heart-o'}
      style={[styles.icons]}
      size={15} />
  );
};

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLiked: props.row.userLiked,
      userSaved: props.row.userSaved
    };
  }

  handleLike = (foodid) => {
    // this.props.authActions.logout();
    if (!userCanPost(this.props.user.name)) {
      LaunchLoginAlert('Login to like pictures', this.props.authActions.logout);
      return;
    }
    this.props.feedActions.likeFood(foodid, this.props.user.fbid, !this.state.userLiked);
    this.setState({
      userLiked: !this.state.userLiked
    });
  }

  handleSave = (foodid) => {
    // this.props.authActions.logout();
    if (!userCanPost(this.props.user.name)) {
      LaunchLoginAlert('Login to save pictures', this.props.authActions.logout);
      return;
    }
    this.props.feedActions.saveFood(foodid, this.props.user.fbid, !this.state.userSaved);
    this.setState({
      userSaved: !this.state.userSaved
    });
  }

  render() {
    const {row} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.thumbnail}
            source={{uri: row.picture}}
            />
          <View style={{marginRight: 20, flexDirection: 'row'}}>
                <CustomText style={styles.title}>
                  {row.title} by {row.name}
                </CustomText>
          </View>
        </View>
        <View>
          {row.tags.length ?
            <CustomText style={styles.hashtags}>
              {modifyTags(row.tags).join(' ')}
            </CustomText>
            : null
          }
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.imageStyles}
            source={{uri: row.foodPic}} />
        </View>
        {row.home &&
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => this.handleLike(row.foodid)} >
              <View
                style={{flexDirection: 'row'}}>
                <ProperLikedIcon
                  value={this.state.userLiked} />
                <CustomText
                  style={[styles.iconsText]}>Likes</CustomText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleSave(row.foodid)} >
              <View style={{flexDirection: 'row'}}>
                <ProperSavedIcon
                  value={this.state.userSaved} />
                <CustomText
                  style={[styles.iconsText]}>
                  Save
                </CustomText>
              </View>
            </TouchableOpacity>
            {row.fbid === this.props.user.fbid &&
              <TouchableOpacity onPress={() => this.props.editData(row)} >
                <View style={{flexDirection: 'row'}}>
                  <FontAwesome
                    style={[styles.icons, {marginTop: 2}]}
                    name="edit"
                    size={15} />
                <CustomText
                  style={styles.iconsText}>
                    Edit
                </CustomText>
                </View>
              </TouchableOpacity>
          }
        </View>
        }
        <View style={styles.horizontalLine} />
      </View>

    );
  }
}

const mapStateToProps = (state) => {
  return ({
    user: state.auth.user
  });
};

const mapDispatchToProps = dispatch => ({
  feedActions: bindActionCreators(feedActionCreators, dispatch),
  authActions: bindActionCreators(authActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
