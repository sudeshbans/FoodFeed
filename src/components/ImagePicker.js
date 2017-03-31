import React from 'react';
import {
  Image,
  TextInput,
  Modal,
  Switch,
  TouchableOpacity,
  Dimensions,
  View,
  Alert,
  Button,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {FontAwesome, MaterialIcons, Entypo} from '@exponent/vector-icons';
import * as feedActionCreators from '../actions/feed';
import CustomText from './CustomText';
import {LaunchDeleteAlert} from '../utilities/appUtils';
import TagsList from './TagsList';

const WindowWidth = Dimensions.get('window').width;
const WindowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  error: {
    padding: 10
  },
  container: {
    backgroundColor: '#fcfcfc',
    width: WindowWidth,
    height: WindowHeight
  },
  textSize: {
    fontSize: 18
  },
  imageAndTextContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#edeaea',
    borderWidth: 1,
    margin: 10,
    marginTop: 10,
    flexDirection: 'row',
    padding: 10
  },
  textError: {
    color: 'red'
  },
  hashtags: {
    padding: 10,
    borderColor: '#edeaea',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10
  },
  switches: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10

  },
  switchesController: {
    borderColor: '#edeaea',
    borderWidth: 1,
    margin: 10

  },
  hashtagIcon: {
    flexDirection: 'row'
  },
  textPadding: {
    paddingTop: 5
  },
  header: {
    backgroundColor: '#254d8e',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewContainer: {
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  create: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 13,
    color: '#f7f7f7'
  },
  delish: {
    fontSize: 16,
    color: '#f7f7f7',
    marginRight: 40,
    alignItems: 'center'
  },
  textInputStlye: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 15,
    backgroundColor: 'transparent' }
});

class ImagePicker extends React.Component {
  static route = {
    navigationBar: {
      backgroundColor: '#336c9b',
      tintColor: '#fcfdff',
      renderTitle: (state) => {
        return (
          <View style={[styles.viewContainer, {flexDirection: 'row'}]}>
            <CustomText style={styles.delish}>
              {state.params.navBarCenterTitle}
            </CustomText>
          </View>
      )},
      renderRight: (state) => {
        const eventEmitter  = state.config.eventEmitter;
        return (
          <TouchableOpacity onPress={() => eventEmitter.emit('navbarevent')} >
            <View style={[styles.viewContainer, {flexDirection: 'row'}]}>
              <CustomText style={styles.create}>
                {state.params.navBarRightTitle}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      description: props.description || null,
      hashtags: props.hashtags || [],
      public: props.public || false
    }
  }

  componentWillMount() {
    this.navbarTrigger = this.props.route.getEventEmitter().addListener('navbarevent', this.create);
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.feeddata) {
        console.log(nextProps.feeddata);
        this.props.navigator.pop();
      }
  }

  componentWillUnmount() {
    this.navbarTrigger.remove();
  }

  addToHastags = (tags) => {
    this.setState({
      modal: false,
      hashtags: tags
    });
  }

  create: EventSubscription;

  create = () => {
    if (!this.state.description) {
      Alert.alert(
        'Add caption to your food',
        'Captions are brief explanation appended to your food',
        [
          {text: 'OK'}
        ]
      );
      return;
    }

    let data;
    if (this.props.edit) {
      data = {
        title: this.state.description,
        public: this.state.public,
        tags: this.state.hashtags,
        foodid: this.props.foodid,
        foodpic: this.props.route.params.image
      }
      this.props.feedActions.updateFood(data);
    } else {
      data = {
        title: this.state.description,
        public: this.state.public,
        creatorname: this.props.user.name,
        profilepicture: this.props.user.picture,
        feedfbid: this.props.user.fbid,
        tags: this.state.hashtags
      };
      this.props.feedActions.addFood(data, this.props.route.params.image);
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.modal}>
          <TagsList
            tagsList={this.state.hashtags}
            done={tags => this.addToHastags(tags)}
            cancel={() => this.setState({modal: false})} />
        </Modal>
        <View style={styles.imageAndTextContainer}>
          {this.props.route.params.image &&
            <Image
              style={{
                height: 100,
                width: 100,
                resizeMode: 'cover'}}
              source={{uri: this.props.route.params.image}} />
          }
          <TextInput
            placeholder="Delicious caption of your food....."
            autoFocus
            value={this.state.description}
            onChangeText={(text) => {
              this.setState({
                description: text
              });
            }}
            style={styles.textInputStlye} />
        </View>
        <TouchableOpacity onPress={() => this.setState({modal: true})}>
          <View style={styles.hashtags}>
            <View
              style={styles.hashtagIcon}>
              <FontAwesome
                name="tags"
                style={{
                  color: '#476fcc',
                  backgroundColor: 'transparent',
                  paddingRight: 5
                }}
                size={20} />
              <CustomText style={styles.textSize}>Tags</CustomText>
            </View>
            <CustomText style={styles.textSize}>({this.state.hashtags.length})</CustomText>
          </View>
        </TouchableOpacity>
        <View style={styles.switchesController}>
          <View style={styles.switches}>
            <View style={styles.hashtagIcon}>
              <MaterialIcons
                name="public"
                style={{
                  color: '#476fcc',
                  backgroundColor: 'transparent',
                  paddingTop: 5,
                  paddingRight: 5
                }}
                size={20} />
              <CustomText style={[styles.textSize, styles.textPadding]}>Public</CustomText>
            </View>
            <Switch
              onValueChange={() => this.setState({public: !this.state.public})}
              value={this.state.public} />
          </View>
        </View>
                    {this.props.edit &&
        <View style={styles.switchesController}>
          <View style={styles.switches}>
            <View style={styles.hashtagIcon}>
              <MaterialIcons
                name="delete"
                style={{
                  color: '#476fcc',
                  backgroundColor: 'transparent',
                  paddingTop: 5,
                  paddingRight: 5
                }}
                size={20} />
              <CustomText style={[styles.textSize, styles.textPadding]}>
                Delete Food
              </CustomText>
            </View>
            <Button
              onPress={() => LaunchDeleteAlert("Are you sure you want to delete this?", Function.prototype)}
              title="Delete Food"
              color="red"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </View>
                }
      </View>
    );
  }
}


const mapStateToProps = state => {
  return ({
    user: state.auth.user,
    feeddata: state.feed.data
  });
}

const mapDispatchToProps = dispatch => ({
  feedActions: bindActionCreators(feedActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagePicker);
