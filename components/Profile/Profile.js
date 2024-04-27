import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './profileStyles.js';

const Profile = ({ loggedInUser }) => {
  return (
    <View>
      <Text>Welcome, {loggedInUser}!</Text>
    </View>
  );
}

export default Profile;