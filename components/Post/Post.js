import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StyleSheet,
  TextInput,
  Image,
  Button,
} from 'react-native';
import { Camera } from 'expo-camera';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const PostScreen = () => {
  const [aphoto, setPhoto] = useState('assets/snack-icon.png');
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;

  const PostStack = createNativeStackNavigator();
  function PostMain() {
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

    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    if (hasPermission !== 'granted' && hasPermission !== true) {
      console.log('no camera permission, ', hasPermission);
      return (
        <View>
          <Text>No Access To Camera</Text>
        </View>
      );
    }

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
            onPress={async () => {
              await snap();
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

    const snap = async () => {
      console.log('Take Snap');
      if (this.SnapCamera) {
        console.log('Camera Available');
        const options = { quality: 0.5, base64: true };
        let photo = await this.SnapCamera.takePictureAsync(options);
        setPhoto(photo.uri);
        console.log('Got the Photo');
        console.log(photo.uri, aphoto);
      }
    };

    return camui;
  }

  function DetailUI() {
    return (
      <View style={styles.detailbackground}>
        <LocationView />
        <View style={{ flex: 2, flexDirection: 'row', width: '100%' }}>
          <Image style={styles.logo} source={{ uri: aphoto }} />
          <CaptionView />
        </View>
        <Button title="Post" onPress={() => postImage()} />
      </View>
    );
  }

  function LocationView() {
    console.log(aphoto);
    const [onetime, setOneTime] = useState(true);

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
      var latitude = location.coords.latitude;
      var longitude = location.coords.longitude;

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
    var smaps = { width: SCREEN_WIDTH / 1.05, height: SCREEN_HEIGHT / 3 };

    var myos = 'unknown';
    if (Platform.OS === 'ios') {
      myos = 'iOS';
    } else if (Platform.OS === 'android') {
      myos = 'Android';
    }
    getGPSPermission(setLocal);

    useEffect(() => {
      if (onetime) {
        if (mylocation === 'permission available') {
          getLocationAsync(setPosition);
        }
        setOneTime(false);
      }
    }, [onetime, mylocation, mypos]);

    return (
      <View style={styles.container}>
        <MapView style={smaps}>{mypos}</MapView>
      </View>
    );
  }

  function CaptionView() {
    const [newdata, setNewData] = useState('Insert Caption');
    return (
      <TextInput
        style={styles.inputbox}
        value={newdata}
        onChangeText={setNewData}
      />
    );
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
      flex: 3,
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
      marginBottom: 'auto',
      marginTop: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderWidth: 2,
      height: '33%',
      fontSize: 22,
    },
    logo: {
      marginBottom: 'auto',
      marginTop: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      height: '72%',
      width: '48%',
      padding: 0,
    },
  });
  return PostMain();
};

export default PostScreen;
