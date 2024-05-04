import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const defaultImage = require('../../assets/default.jpg');

const Map = () => {
  const [posts, setPosts] = useState([]);
  const [profilePics, setProfilePics] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchProfilePics();
  }, []);

  const fetchProfilePics = async () => {
    try {
      const response = await fetch("https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=FishMongerPics");
      const data = await response.json();
      setProfilePics(data);
    } catch (error) {
      console.error('Error fetching profilePictures:', error);
    }
  }

  const renderProfilePic = (post) => {

      const userProfile = profilePics.find(profile => profile.userName === post.userName);
      if (userProfile) {
        const base64ImageUri = `data:image/jpg;base64,${userProfile.profilePic}`;
    return <Image source={{ uri: base64ImageUri }} style={styles.profilePic} />;
      }
    return <Image source={defaultImage} style={styles.profilePic} />;
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=ReelRecordPosts1');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.618881, // Default latitude
          longitude: -116.215019, // Default longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {posts.map((post, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            title={post.caption}
          >
            <Callout>
              <View>
                {/* Display post image here */}
                <View style={styles.profileContainer}>
  {renderProfilePic(post)}
  <Text style={styles.userNameStyle}>{post.userName}</Text>
</View>
                <Image source={{ uri: `data:image/jpg;base64,${post.image}` }} style={styles.image} />
                <Text>{post.caption}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  profilePic: {
    width: 30, 
    height: 30,
    borderRadius: 15, 
    marginRight: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Cochin',
  },
});

export default Map;
