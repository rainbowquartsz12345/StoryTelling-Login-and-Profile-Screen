import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  Switch,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Google from 'expo-google-app-auth';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase'

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    //define the states
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      profile_image: '',
      name: ''
    };
  }
  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  toggleSwitch() {
     const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? 'dark': 'light'
    var updates = {}
    updates['/users/' + firebase.auth().currentUser.uid+ '/current_theme'] = theme
    firebase.database().ref().update(updates)
    this.setState({
      isEnabled: !previous_state, light_theme: previous_state
    })
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  async fetchUser() {
     let theme, name, image;
     //fetches the user for us based on their unique id, 
     //which we can find from the firebase.auth().currentUser.uid.
    await firebase
    .database()
    .ref("/users/" + firebase.auth().currentUser.uid )
    .on('value', function(snapshot){
      theme = snapshot.val().current_theme
      name = `${snapshot.val().first_name} ${snapshot.val().last_name}`
      image = snapshot.val().profile_picture
    
    } )
     this.setState({
      light_theme: theme === 'light' ? true : false,
      isEnabled: theme === 'light'? false: true,
      name: name,
      profile_image: image
     
    })
  }

  

  render() {
    console.log(this.state.profile_image);
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>

          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
            {/*Add the profile picture and name of the user */}
              <Image style={styles.profileImage} source = {{uri: this.state.profile_image}}/>
              <Text style={styles.nameText}> {this.state.name} </Text>
            </View>
            <View style={styles.themeContainer}>
              <Text style={styles.themeText}>Dark Theme</Text>
              <Switch
              ios_backgroundColor="#3e3e3e"
                style={{
                  transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                }}
                trackColor = {{false: '#767577', true: 'white' }}
                thumbColor = {this.state.isEnabled ? 'orange' : 'grey'}
                onValueChange = {()=> this.toggleSwitch()}
                value = {this.state.isEnabled}
              />
            </View>
            <View style={{ flex: 0.3 }} />
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  screenContainer: {
    flex: 0.85,
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
  },
  nameText: {
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    marginTop: RFValue(10),
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: RFValue(20),
  },
  themeText: {
    color: 'white',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
    marginRight: RFValue(15),
  },
});
