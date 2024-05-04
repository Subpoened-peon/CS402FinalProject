import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const Map = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

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
});

export default Map;
