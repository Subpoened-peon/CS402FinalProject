import React, { Component } from 'react';
import {useState,useEffect} from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import  MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map() {
  const defaultLocation = { // Default location coordinates
    latitude: 37.78825,
    longitude: -122.4324,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={defaultLocation}
          title="Default Location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
