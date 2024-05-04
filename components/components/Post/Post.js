import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  Image,
  Button,
  Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

async function pullPosts(aPostSet, loadUrl) {
  try {
    const response = await fetch(loadUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();

    const newPostList = posts.map((post) => ({
      userName: post.userName,
      caption: post.caption,
      latitude: post.latitude,
      longitude: post.longitude,
      image: post.image,
    }));
    aPostSet(newPostList);
  } catch (error) {
    console.error('Error pulling posts:', error);
    throw error;
  }
}

const PostScreen = ({ navigation, route }) => {
  const { loggedInUser } = route.params;
  console.log(loggedInUser);
  const [postList, setPostList] = useState([]);
  const [aphoto, setPhoto] = useState('assets/snack-icon.png');
  const latRef = useRef(0.0);
  const longRef = useRef(0.0);
  const capRef = useRef('insert caption');

  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;

  useEffect(() => {
    const loadAddress =
      'https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=ReelRecordPosts1';
    pullPosts(setPostList, loadAddress);
  }, []);

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
      if (this.SnapCamera) {
        const options = { quality: 0.5, base64: true };
        let photo = await this.SnapCamera.takePictureAsync(options);
        console.log(photo.base64);
        setPhoto(photo.base64);
      }
    };

    return camui;
  }

  function DetailUI() {
    return (
      <View style={styles.detailbackground}>
        <LocationView />
        <View style={{ flex: 2, flexDirection: 'row', width: '100%' }}>
          <Image style={styles.logo} source={{ uri:`data:image/jpg;base64,${aphoto}`}} />
          <CaptionView />
        </View>
        <Button title="Post" onPress={() => postImage()} />
      </View>
    );

    function LocationView() {
      const [mylocation, setLocal] = useState();
      const [region, setRegion] = useState(null);

      const getGPSPermission = useCallback(async (alocalf) => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted' && status !== true) {
          alocalf('Permission to access location was denied');
        } else {
          alocalf('permission available');
        }
      }, []);

      getGPSPermission(setLocal);
      useEffect(() => {
        const fetchCurrentLocation = async () => {
          // Fetch current location
          const location = await Location.getCurrentPositionAsync({
            accuracy: 6,
          });
          const { latitude, longitude } = location.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          latRef.current = latitude;
          longRef.current = longitude;
        };
        fetchCurrentLocation();
      }, [region]);

      var smaps = { width: SCREEN_WIDTH / 1.05, height: SCREEN_HEIGHT / 3 };

      return (
        <View style={styles.container}>
          {region && (
            <MapView initialRegion={region} style={smaps}>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                title={'Your Location'}
              />
            </MapView>
          )}
        </View>
      );
    }

    function CaptionView() {
      const [acaption, setCaption] = useState('');
      capRef.current = acaption;
      return (
        <TextInput
          style={styles.inputbox}
          value={acaption}
          placeholder={'Insert caption'}
          onChangeText={setCaption}
        />
      );
    }

    async function postImage() {
      const saveAddress =
        'https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=ReelRecordPosts1';
      const newPost = {
        userName: loggedInUser,
        caption: capRef.current,
        latitude: latRef.current,
        longitude: longRef.current,
        image: aphoto,
      };

      const updatedPostList = [newPost, ...postList];
      setPostList(updatedPostList);

      await addNewPost(saveAddress, updatedPostList);
      Alert.alert('Successfully posted.');
      
      navigation.navigate('Scroll');
    }

    async function addNewPost(saveUrl, postList) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postList),
        };

        const response = await fetch(saveUrl, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to save post data');
        }
      } catch (error) {
        console.error('Error saving post data:', error);
        throw error;
      }
    }
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