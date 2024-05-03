import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Gallery = ({ navigation, route }) => {
  const { loggedInUser } = route.params;
  console.log(loggedInUser);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch posts from the remote URL
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        'https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=ReelRecordPosts'
      );
      const data = await response.json();
      let filteredPosts = []
      for(let post of data){
        console.log(post, post.userName);
        if(post.userName===loggedInUser){
          filteredPosts = [...filteredPosts, post];
        }
      }
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostPress = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.multipleposts}>
        {posts.map((post, index) => (
          // console.log(post.userName, loggedInUser, '==:', post.userName==loggedInUser, '===: ', post.userName===loggedInUser);
          // console.log('made it');
          <TouchableOpacity key={index} onPress={() => handlePostPress(post)}>
            <View style={styles.postContainer}>
              <Image source={{ uri: post.image }} style={styles.image} />
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
                }}>
                <Marker
                  coordinate={{
                    latitude: selectedPost.latitude,
                    longitude: selectedPost.longitude,
                  }}
                  title="Post Location"
                />
              </MapView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  multipleposts: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postContainer: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 130,
    height: 205,
    borderRadius: 10,
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
});

export default Gallery;
