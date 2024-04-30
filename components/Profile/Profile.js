import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import styles from './profileStyles.js';

const loadAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=FishMongerPics";

const saveAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=FishMongerPics";

async function pullProfilePics(aUserSet, loadUrl) {
  try {
    const response = await fetch(loadUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userNames = await response.json();

    const newProfilePicList = userNames.map(user => ({
      userName: user.userName,
      profilePic: user.profilePic,
    }));
    aUserSet(newProfilePicList);
  } catch (error) {
    console.error('Error checking username existence:', error);
    throw error;
  }
}

const Profile = ({ loggedInUser}) => {
  const [profilePics, setProfilePics] = useState([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  useEffect(() => {
    pullProfilePics(setProfilePics, loadAddress);
  }, []);

  const hasProfilePic = profilePics.some(pic => pic.userName === loggedInUser);

  return (
    <View style={styles.container}>
    <Text style={styles.message}>Profile viewed inside Tab Navigator</Text>
  </View>
  );
};

export default Profile;
