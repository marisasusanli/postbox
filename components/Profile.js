import React, { Component } from 'react';
import panda from '../assets/panda.jpg';
import * as firebase from 'firebase';
import 'firebase/firestore';
import PhotoGrid from './GalleryGridProfile';
import { connect } from 'react-redux';
import { getUser } from './store/user';
import { deleteSinglePhoto } from './store/photo'

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import { profilePhotos } from './store/photo';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
       await this.props.getUser(user.uid)
      }
      this.props.getProfilePhotos(this.props.user.postcards)
    });
  }

  handleDelete(id) {
    console.log('handle delete')
    this.props.deletePhoto(id);
  }

  render() {
    const { navigate } = this.props.navigation;
    const { username, postcards, about } = this.props.user;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.circleImage} source={panda} />
          <View style={styles.info}>
            <Text style={styles.infoName}>{username}</Text>
            <Text style={styles.infoDesc}>{about}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.edit}
          onPress={() => navigate('EditProfile')}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.gallery}>
          <PhotoGrid photos={this.props.postcards} numColumns={1} handleDelete={this.handleDelete}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e1e1e4',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  gallery: {
    flex: 1,
    backgroundColor: '#fff',
  },
  edit: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    height: 25,
    width: "40%",
    borderWidth: 0.2,
    borderBottomColor: '#585858',
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 12,
    color: 'black',
    alignSelf: "center",
  },
  header: {
    flex: 0.5,
    paddingTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    alignContent: 'flex-start',
    backgroundColor: '#F8F8F8',
    marginBottom: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  info: {
    marginTop: 10,
    alignItems: 'center',
  },
  infoName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoDesc: {
    fontSize: 14,
    paddingBottom: 18,
  },
  circleImage:{
    height: 110,
    width: 110,
    borderRadius: 500,
  },
});

const mapState = (state) => {
  return {
    user: state.user,
    postcards: state.photo
  };
};

const mapDispatch = (dispatch) => {
  return {
    getUser: (id) => dispatch(getUser(id)),
    deletePhoto: (id) => dispatch(deleteSinglePhoto(id)),
    getProfilePhotos: (data) => dispatch(profilePhotos(data))
  };
};

export default connect(mapState, mapDispatch)(Profile);
