import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './profileStyles.js';
import * as ImagePicker from 'expo-image-picker';

const defaultImage = require('../../assets/default.jpg');

async function pullProfilePics(aProfileSet, loadUrl) {
  try {
    const response = await fetch(loadUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userProfiles = await response.json();

    const newProfileList = userProfiles.map(profile => ({
      userName: profile.userName,
      profilePic: profile.profilePic,
    }));

    aProfileSet(newProfileList);
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    throw error;
  }
}

async function addNewProfilePic(saveUrl, profilePics) {
  try {
    const requestOptions = {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(profilePics)
    };

    const response = await fetch(saveUrl, requestOptions);

    if (!response.ok) {
      throw new Error('Failed to save user data');
    }

    console.log(response);
    console.log("Save operation successful");
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}


export default function ProfileMain({ navigation, route }) {
  const { loggedInUser } = route.params;
  const [profilePics, setProfilePics] = useState([]);
  const [customImageBase64, setCustomImageBase64] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  console.log("Is the user in Profile? : " + loggedInUser);

  useEffect(() => {
    const loadAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=FishMongerPics";
    pullProfilePics(setProfilePics, loadAddress);
  }, []);

  useEffect(() => {
    (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
        }
    })();
}, []);

  /**
   * This function handles converting the image into base64 so it is saveable on the url.
   */
  async function profileHandler() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
    base64: true, // Convert image to base64
  });

  console.log("Base64 image:", result.assets[0].base64);

  if (!result.cancelled) {
    const newProfilePic = { userName: loggedInUser, profilePic: result.assets[0].base64 };
    const updatedProfilePics = [...profilePics]; // Copy the profile pics array

    const existingProfileIndex = updatedProfilePics.findIndex(profile => profile.userName === loggedInUser);

    if (existingProfileIndex !== -1) {
      // If profile exists, update it
      updatedProfilePics[existingProfileIndex] = newProfilePic;
    } else {
      // If profile doesn't exist, add it to the list
      updatedProfilePics.push(newProfilePic);
    }

    console.log("Updated profile pics:", updatedProfilePics);

    // Update the state with the new profile picture list
    setProfilePics(updatedProfilePics);

    const saveAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=FishMongerPics";
    await addNewProfilePic(saveAddress, updatedProfilePics); // Wait for the state update to complete
    Alert.alert("Successfully saved your profile picture!");
  } else {
    console.log("Cancelled");
  }
}

  
const renderProfilePic = () => {

      const userProfile = profilePics.find(profile => profile.userName === loggedInUser);
      if (userProfile) {
        console.log("Profile User Name:", userProfile.userName);
        console.log(userProfile.profilePic);
        const base64ImageUri = `data:image/jpg;base64,${userProfile.profilePic}`;
    return <Image source={{ uri: base64ImageUri }} style={styles.profilePic} />;
      }
    return <Image source={defaultImage} style={styles.defaultPic} />;

  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Hello {loggedInUser}!</Text>
      {renderProfilePic()}
      <TouchableOpacity onPress={profileHandler} style={styles.button}>
        <Text style={styles.buttonText}>Set Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );
}
