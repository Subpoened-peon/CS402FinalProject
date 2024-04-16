import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal,
  ScrollView,
  Dimensions,
  Share, 
  Alert //was used for testing
} from 'react-native';
import { Camera } from 'expo-camera';
import { useWindowDimensions } from 'react-native';

/*
* Nicholas Merritt
*/

export default function CameraApp() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imagesList, setImagesList] = useState([]);
  const [lastSavedImage, setLastSavedImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [windowWidth, windowHeight] = [
    useWindowDimensions().width,
    useWindowDimensions().height,
  ];
  const [showImageList, setShowImageList] = useState(false);
  const [zoomedImageDimensions, setZoomedImageDimensions] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (
          cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
          storagePermission === PermissionsAndroid.RESULTS.GRANTED
        ) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } else if (Platform.OS === 'ios') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setCapturedImage(photo.uri);
    }
  };

  const saveImageToList = () => {
    if (capturedImage) {
      setImagesList([...imagesList, capturedImage]);
      setLastSavedImage(capturedImage);
      setCapturedImage(null);
    }
  };
//This just makes all of the items larger for clarity. Tried to have it do it for just the selected image but could not. This works too
 const zoomImage = () => {
    setIsZoomed(!isZoomed); 
    if (!isZoomed) {

      const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
      const zoomedImageWidth = screenWidth;
      const zoomedImageHeight = screenHeight * 0.75;
      setZoomedImageDimensions({ width: zoomedImageWidth, height: zoomedImageHeight });
    } else {
      setZoomedImageDimensions(null);
    }
};

//Not sure about the warnings but it successfully switches between cameras. At first I saw a deprecated function warning somewhere and I thought it was here.
  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

//If an image is selected, and only one can be, it removes it.
const removeSelectedImage = () => {
  if (selectedImageIndex !== null) {
    const updatedImagesList = imagesList.filter((_, index) => index !== selectedImageIndex);
    setImagesList(updatedImagesList);
    setSelectedImageIndex(null);
    setLastSavedImage(null);
  }
};

const shareImage = async (imageUri) => {
  try {
    if (imageUri) {
      await Share.share({
        message: 'Check out this image!',
        url: imageUri,
      });
    } else {
      console.log("Nothing");
    }
  } catch (error) {
    console.error('Error sharing image:', error.message);
  }
};

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <View />
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.cameraContainer}>
            <Camera
              style={[
                styles.cameraView,
                {
                  width: windowWidth,
                  aspectRatio: windowWidth / ((windowHeight * 4) / 5),
                },
              ]}
              type={cameraType}
              ref={(ref) => setCamera(ref)}>
              <View style={styles.cameraOverlay}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                />
              </View>
            </Camera>
          </View>
          <TouchableOpacity
            style={[styles.lastSavedImageContainer, { bottom: 20, right: 20 }]}
            onPress={() => 
            setShowImageList(true)}>
            {lastSavedImage && (
              <Image
                source={{ uri: lastSavedImage }}
                style={styles.lastSavedImageButton}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleCameraType}>
            <Text>Switch</Text>
          </TouchableOpacity>
          {capturedImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: capturedImage }}
                style={[styles.previewImage, { alignSelf: 'flex-end' }]}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveImageToList}>
                <Text>Save Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: 'red', marginLeft: 10 },
                ]}
                onPress={() => setCapturedImage(null)}>
                <Text>Discard</Text>
              </TouchableOpacity>
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={false}
            visible={showImageList}
            onRequestClose={() => setShowImageList(false)}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.imageList}>
              {imagesList.map((image, index) => (
  <TouchableOpacity
    key={index}
    onPress={() => {
        if (selectedImageIndex === index) {
          setSelectedImageIndex(null);
        } else {
          setSelectedImageIndex(index);
        }
      }}
  >
    <Image
      source={{ uri: image }}
      style={[
        styles.imageListItem,
        selectedImageIndex === index && styles.selectedImage,
        zoomedImageDimensions && {
          width: zoomedImageDimensions.width,
          height: zoomedImageDimensions.height,
        },
      ]}
    />
  </TouchableOpacity>
))}
              </ScrollView>
              <View style={styles.listButtonContainer}>
  <TouchableOpacity
    style={styles.closeButton}
    onPress={() => setShowImageList(false)}>
    <Text style={styles.closeButtonText}>Close</Text>
  </TouchableOpacity>
    <TouchableOpacity
  style={styles.closeButton}
  onPress={() => zoomImage()}
>
  <Text style={styles.closeButtonText}>
    {isZoomed ? 'Shrink' : 'Zoom'}
  </Text>
</TouchableOpacity>
<TouchableOpacity
    style={styles.closeButton}
    onPress={removeSelectedImage}>
    <Text style={styles.closeButtonText}>Remove</Text>
  </TouchableOpacity>
  <TouchableOpacity
  style={styles.closeButton}
  onPress={() => shareImage(imagesList[selectedImageIndex])}
>
  <Text style={styles.closeButtonText}>Share</Text>
</TouchableOpacity>
</View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cameraContainer: {
    flex: 6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cameraView: {
    aspectRatio: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  lastSavedImageContainer: {
    position: 'absolute',
    borderRadius: 50,
    overflow: 'hidden',
  },
  lastSavedImageButton: {
    width: 125,
    height: 125,
    borderWidth: 8,
  },
  listButtonContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 375,
    height: 375,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  switchButton: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'red',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 30,
  },
  imageListItem: {
    width: 100,
    height: 100,
    margin: 6,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
