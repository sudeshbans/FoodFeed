import React from 'react';
import {
  TouchableOpacity,
  ListView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  View
} from 'react-native';
import {Ionicons, FontAwesome} from '@exponent/vector-icons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Exponent from 'exponent';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import Card from './Card';
import CustomText from './CustomText';
import * as feedActionCreators from '../actions/feed';
import * as authActionCreators from '../actions/auth';
import {debounce, userCanPost, LaunchLoginAlert} from '../utilities/appUtils';

const SELECTED_COLOR = '#99ccff';
const NOT_SELECTED_COLOR = '#ffffff';
const WindowWidth = Dimensions.get('window').width;
const WindowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    opacity: 1,
    height: WindowHeight - 100
  },
  footerImage: {
    backgroundColor: '#336c9b',
    width: WindowWidth,
    height: 50,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footerImageOverWrite: {
    justifyContent: 'center'
  },
  footerContinaer: {
    flex: 1,
    height: 50,
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    bottom: 0
  }
});

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
  return r1 !== r2;
}});

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: false,
      selected: {
        title: 'Feed',
        key: 'home'
      }
    };
  }

  componentWillMount() {
    this.props.feedActions.getNewFeed();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.feed.data.length) {
      this.setState({
        refreshing: false,
        dataSource: this.state.dataSource.cloneWithRows([].concat(nextProps.feed.data))
      });
    }
  }

  getNewFeed = debounce(() => {
    this.props.feedActions.getNewFeed();
  }, 1000)

  loadRecentData = () => {
    this.setState({
      refreshing: true
    });
    this.getNewFeed();
  }

  handleSave = () => {
    // this.props.authActions.logout();
    if (!userCanPost(this.props.user.name)) {
      LaunchLoginAlert('Login to save your pictures', this.props.authActions.logout);
      return;
    }
    this.setState({
      selected: {
        title: 'Saved',
        key: 'saved'
      }
    });
    this.props.feedActions.getSavedFeed();
  }

  handleFeed = () => {
    this.setState({
      selected: {
        title: 'Feed',
        key: 'home'
      }
    });
    this.props.feedActions.getNewFeed();
  }

  launchCamera = async () => {
    if (!userCanPost(this.props.user.name)) {
      LaunchLoginAlert('Login to share your delicious pictures', this.props.authActions.logout);
      return;
    }
    const result = await Exponent.ImagePicker.launchCameraAsync({allowsEditing: true});
    this.pushNav(result);
  }

  launchPicker = async () => {
    // this.props.authActions.logout();
    if (!userCanPost(this.props.user.name)) {
      LaunchLoginAlert('Login to share your delicious pictures', this.props.authActions.logout);
      return;
    }
    const result = await Exponent.ImagePicker.launchImageLibraryAsync({allowsEditing: true});
    this.pushNav(result);
  }

  loadOldData = (page) => {
    this.getOldFeed(page);
  }

  editData = (row) => {
    this.props.navigator.push('imagePicker', {
        image: row.foodPic,
        description: row.title,
        foodid: row.foodid,
        hashtags: row.tags,
        public: row.public,
        location: false,
        navBarRightTitle: 'Update',
        navBarCenterTitle: 'Update Your Delish..',
        edit: true
      });
  }

  pushNav = (result) => {
    if (!result.cancelled) {
      this.props.navigator.push('imagePicker', {
        image: result.uri,
        navBarCenterTitle: 'Add Your Delish..',
        navBarRightTitle: 'Create'
      });
    }
  }

  render() {
    const refreshFunc = this.state.selected.title === 'Feed' ? this.props.feedActions.getNewFeed : this.props.feedActions.getSavedFeed;

    return (
      <View
        style={{flex: 1}}>
        <View
          style={[styles.footerImage, styles.footerImageOverWrite]}>
          <CustomText style={{color: 'white', paddingTop: 10}}>
            {this.state.selected.title}
          </CustomText>
          { this.state.selected.title === 'Feed' &&
            <FontAwesome
              name="feed"
              style={{
                paddingLeft: 5,
                paddingTop: 10,
                color: NOT_SELECTED_COLOR,
                backgroundColor: 'transparent'
              }}
              size={15} />

          }
        </View>
        <View style={styles.container}>
          { /*         <ListView
            enableEmptySections
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            dataSource={this.state.dataSource}
            renderRow={rowData => <MyRow
              row={rowData}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.loadRecentData}
              />
            }
            canLoadMore
            onLoadMoreAsync={() => this.loadOldData('1')}
          />
          */}
          <ListView
            enableEmptySections
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            dataSource={this.state.dataSource}
            canLoadMore
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={refreshFunc}
              />
            }
            onLoadMoreAsync={() => Function.Prototype}
            renderRow={rowData => <Card row={rowData} editData={this.editData} />
             }
           />
        </View>
        <View
          style={styles.footerContinaer}>
          <View
            style={styles.footerImage}>
            <TouchableOpacity onPress={this.handleFeed}>
              <View>
                <Ionicons
                  name="ios-home-outline"
                  style={{
                    paddingRight: 50,
                    paddingLeft: 50,
                    color: this.state.selected.key === 'home' ?
                    SELECTED_COLOR : NOT_SELECTED_COLOR,
                    backgroundColor: 'transparent'
                  }}
                  size={28} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.launchPicker}>
                <View >
              <Ionicons
                name="ios-images-outline"
                style={{
                  paddingRight: 50,
                  paddingLeft: 50,
                  marginRight: 20,
                  color: NOT_SELECTED_COLOR,
                  backgroundColor: 'transparent'
                }}
                size={28} />
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.launchCamera}>
              <View >
              <Ionicons
                name="ios-camera-outline"
                style={{
                  paddingRight: 50,
                  paddingLeft: 20,
                  marginLeft: 20,
                  color: NOT_SELECTED_COLOR,
                  backgroundColor: 'transparent'
                }}
                size={32} />
                    </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSave}>
                <View >
              <FontAwesome
                name="save"
                style={{
                  paddingRight: 50,
                  paddingLeft: 50,
                  color: this.state.selected.key === 'saved' ?
                  SELECTED_COLOR : NOT_SELECTED_COLOR,
                  backgroundColor: 'transparent'
                }}
                size={20} />
            </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return ({
    user: state.auth.user,
    feed: state.feed
  });
};

const mapDispatchToProps = dispatch => ({
  feedActions: bindActionCreators(feedActionCreators, dispatch),
  authActions: bindActionCreators(authActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
