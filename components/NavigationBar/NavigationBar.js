
import React from 'react';
import { Image, ImageBackground, Text, SafeAreaView, StyleSheet, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// #TODO REMOVE PLACEHOLDER SCREENS
// Placeholder screen for Map button
export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text>Map Screen</Text>
    </View>
  );
}

// Placeholder screen for Scroll button
export function ScrollScreen() {
  return (
    <View style={styles.container}>
      <Text>Scroll Screen</Text>
    </View>
  );
}

// Placeholder screen for Post button
export function PostScreen() {
  return (
    <View style={styles.container}>
      <Text>Post Screen</Text>
    </View>
  );
}

// Placeholder screen for Gallery button
export function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Text>Gallery Screen</Text>
    </View>
  );
}

// Placeholder screen for Profile button
export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Scroll') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Scroll" component={ScrollScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
