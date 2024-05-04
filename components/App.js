import React, { useState, useEffect } from 'react';
import { Image, ImageBackground, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import InitialLogin from './components/InitialLogin/InitialLogin';
import NavigationBar from './components/NavigationBar/NavigationBar';

const back = require('./assets/loginBack.png');
const logo = require('./assets/RRL.png');

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <NavigationContainer>
      {!isLoggedIn && (
        <>
          <ImageBackground source={back} resizeMode="cover" style={styles.backgroundImage} />
          <Image source={logo} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome!</Text>
          <InitialLogin setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} />
        </>
      )}
      {isLoggedIn && <NavigationBar loggedInUser={loggedInUser}/>}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  logo: {
    height: 320,
    width: 250,
    alignSelf: 'center', // Horizontally center the logo
    marginTop: 10,
  },
  welcomeText: {
    textAlign: 'center', // Center the text horizontally
    fontSize: 24,
    marginTop: 10,
  },
});
