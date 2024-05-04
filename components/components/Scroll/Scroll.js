import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const defaultImage = require('../../assets/default.jpg');

const Scroll = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [profilePics, setProfilePics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch posts from the remote URL
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

  const renderProfilePic = (post) => {

      const userProfile = profilePics.find(profile => profile.userName === post.userName);
      if (userProfile) {
        const base64ImageUri = `data:image/jpg;base64,${userProfile.profilePic}`;
    return <Image source={{ uri: base64ImageUri }} style={styles.profilePic} />;
      }
    return <Image source={defaultImage} style={styles.profilePic} />;
  };
  
  const handlePostPress = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {posts.map((post, index) => (
        <TouchableOpacity key={index} onPress={() => handlePostPress(post)}>
          <View style={styles.postContainer}>
          <View style={styles.profileContainer}>
  {renderProfilePic(post)}
  <Text style={styles.userNameStyle}>{post.userName}</Text>
</View>
            <Image source={{ uri: `data:image/jpg;base64,${post.image}`}} style={styles.image} />
            <Text style={styles.caption}>{post.caption}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Modal visible={!!selectedPost} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        {selectedPost && (
          <View style={styles.modalContent}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedPost.latitude,
                longitude: selectedPost.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Marker
                coordinate={{
                  latitude: selectedPost.latitude,
                  longitude: selectedPost.longitude,
                }}
                title="Post Location"
              />
            </MapView>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  postContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userNameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Cochin',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  map: {
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButton: {
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  profilePic: {
    width: 30, 
    height: 30,
    borderRadius: 15, 
    marginRight: 10,
  },
});

export default Scroll;