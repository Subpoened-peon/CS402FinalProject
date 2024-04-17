import { Image, ImageBackground, Text, SafeAreaView, StyleSheet, View } from 'react-native';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import InitialLogin from './components/InitialLogin/InitialLogin';

const back = require('./assets/loginBack.png');
const logo = require('./assets/RRL.png');

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
    <ImageBackground source = {back} resizeMode="cover" style={styles.backgroundImage}/>
    <Image source = {logo} style = {styles.logo}/>
    <Text>Welcome!</Text>
      <InitialLogin  />
    </SafeAreaView>
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
