import React from 'react';
import { Image, ImageBackground, Text, SafeAreaView, StyleSheet, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../Profile/Profile';
import PostScreen from '../Post/Post';
import Map from '../Map/Map';
import Scroll from '../Scroll/Scroll';

// Placeholder screen for Gallery button
export function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Text>Gallery Screen</Text>
    </View>
  );
}

// Placeholder screen for Profile button
export function ProfileScreen({route}) {
  const {loggedInUser} = route.params;
  <Profile loggedInUser={loggedInUser} />
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({loggedInUser}) {
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
      <Tab.Screen name="Map" component={Map} initialParams={{ loggedInUser }} />
      <Tab.Screen name="Scroll" component={Scroll} initialParams={{ loggedInUser }} />
      <Tab.Screen name="Post" component={PostScreen} initialParams={{ loggedInUser }} />
      <Tab.Screen name="Gallery" component={GalleryScreen} initialParams={{ loggedInUser }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ loggedInUser }} />
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
