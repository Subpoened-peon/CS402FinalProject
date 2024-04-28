import React, {useState, useEffect} from 'react';

import { Image, ImageBackground, Text, SafeAreaView, StyleSheet, View } from 'react-native';

// You can import supported modules from npm
import { Card } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

// or any files within the Snack
import InitialLogin from './components/InitialLogin/InitialLogin';
import Profile from './components/Profile/Profile';
import NavigationBar from './components/NavigationBar/NavigationBar'

const back = require('./assets/loginBack.png');
const logo = require('./assets/RRL.png');

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <ImageBackground source={back} resizeMode="cover" style={styles.backgroundImage} />
        {!isLoggedIn && (
          <>
            <Image source={logo} style={styles.logo} />
            <Text>Welcome!</Text>
            <InitialLogin setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} />
          </>
        )}
      </View>
      {isLoggedIn && <NavigationBar />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 1,
    alignItems: 'center',
    top: -280
  },
  backgroundImage: {
    flex: 1,
    left: -390
  },
  logo: {
    height: 320,
    width: 250,
    top: 10
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
