import React, { useState, useEffect } from 'react';
import {Text, View, TouchableOpacity, useWindowDimensions, Platform, StyleSheet, TextInput} from 'react-native';
import { Camera } from 'expo-camera';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const PostStack = createNativeStackNavigator();
export default function PostMain() {
  return (
    <PostStack.Navigator>
      <PostStack.Screen name="Camera" component={CameraUI} />
      <PostStack.Screen name="Details" component={DetailUI} />
    </PostStack.Navigator>
  );
}

function CameraUI({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [onetime, setOneTime] = useState(true);

  useEffect(() => {
    if (onetime) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

      setOneTime(false);
    }
  }, [onetime]);

  if (hasPermission !== 'granted' && hasPermission !== true) {
    console.log('no camera permission, ', hasPermission);
    return (
      <View>
        <Text>No Access To Camera</Text>
      </View>
    );
  }

  const snap = async () => {
    console.log('Take Snap');
    if (this.SnapCamera) {
      console.log('Camera Available');
      const options = { quality: 0.5, base64: true };
      let photo = await this.SnapCamera.current.takePictureAsync(options);
      setPhoto(photo.uri);
      console.log('Got the Photo');
    }
  };

  var camui = <Text> Major Failure</Text>;
  camui = (
    <View style={styles.cambackground}>
      <Camera
        ref={(ref) => {
          this.SnapCamera = ref;
          console.log('displaying camera');
        }}
        style={styles.camera}
        type={type}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            snap();
            navigation.navigate('Details');
          }}>
          <Text style={styles.bstyle}> Snap </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
          <Text style={styles.bstyle}> Flip </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return camui;
}

function DetailUI() {
  return (
    <View style={styles.detailbackground}>
      <LocationView />
      <CaptionView />
    </View>
  );
}

function LocationView() {
  async function getGPSPermission(alocalf) {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted' && status !== true) {
      alocalf('Permission to access location was denied');
    } else {
      alocalf('permission available');
    }
  }
  async function getLocationAsync(amarkf) {
    console.log('getting location');
    let location = await Location.getCurrentPositionAsync({});
    console.log('got location');

    var text = JSON.stringify(location);
    var bapos = (
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title={'place1'}
        description={'CS402 GPS'}
      />
    );

    amarkf(bapos);
  }

  var apos = (
    <Marker
      coordinate={{ latitude: 0.78825, longitude: -122.4324 }}
      title={'place1'}
      description={'description'}
      image={require('../../assets/snack-icon.png')}
    />
  );

  const [mylocation, setLocal] = useState();
  const [mypos, setPosition] = useState(apos);
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
  var smaps = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2 };

  var myos = 'unknown';
  if (Platform.OS === 'ios') {
    myos = 'iOS';
  } else if (Platform.OS === 'android') {
    myos = 'Android';
  }
  getGPSPermission(setLocal);

  useEffect(() => {
    if (mylocation === 'permission available') {
      getLocationAsync(setPosition);
    }
  }, [mylocation, mypos]);

  return (
    <View style={styles.container}>
      <MapView style={smaps}>{mypos}</MapView>
    </View>
  );
}

function CaptionView() {
  const [newdata, setNewData] = useState("Insert Caption");
  return(<TextInput style={styles.inputbox} value={newdata} onChangeText={setNewData}/>);
}

const styles = StyleSheet.create({
  cambackground: {
    flex: 4,
    flexDirection: 'column',
    borderWidth: 5,
    backgroundColor: 'gray',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  detailbackground: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  camera: {
    flex: 4,
    width: '90%',
    padding: 5,
    borderWidth: 6,
    objectFit: 'cover',
  },
  bstyle: {
    padding: 2,
    borderwidth: 2,
  },
  buttonRow: {
    flex: 0.5,
    alignItems: 'center',
    borderWidth: 2,
    padding: 0,
    flexDirection: 'row',
    margin: 1,
    justifyContent: 'space-around',
    backgroundColor: 'lightgray',
    fontSize: 12,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    backgroundColor: '#ecf0f1',
  },
  inputbox: {
    borderWidth: 2,
    height: '40%',
    fontSize: 22,
  }
});
