import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps"; 

export default class MapScreen extends Component {
  render() {
    return (
    // <View style={styles.container}>
      <MapView
        showsUserLocation
        followsUserLocation
        style={styles.map}
        region={{
          latitude: this.props.userLatitude,
          longitude: this.props.userLongitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        }}
      >
        {this.props.children}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

