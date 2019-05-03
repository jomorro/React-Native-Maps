// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import MapScreen from "./MapScreen";
import PlaceInput from "./components/PlaceInput";
import axios from "axios";
import PolyLine from "@mapbox/polyline";
import MapView, { Polyline, Marker } from "react-native-maps";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMapPermission: false,
      userLatitude: 0,
      userLongitude: 0,
      desinationCoords: []
    };
    this.locationWatchId = null;
    this.showDirectionsOnMap = this.showDirectionsOnMap.bind(this);
    this.map = React.createRef();
  }

  componentDidMount() {
    this.requestFineLocation();
  }
  
  hideKeyboard() {
    Keyboard.dismiss();
  }

  componentWillMount() {
    navigator.geolocation.clearWatch(this.locationWatchId);
  }

  async showDirectionsOnMap(placeId) {
    const { userLatitude, userLongitude } = this.state;
    try {
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=place_id:${placeId}&key=AIzaSyA0GCw9Vtqr7arl8J1S-UhlK-tvs0pWjsc`
      );
      console.log(result.data);
      const points = PolyLine.decode(
        result.data.routes[0].overview_polyline.points
      );
      const latLng = points.map(point => ({
        latitude: point[0],
        longitude: point[1]
      }));
      this.setState({ desinationCoords: latLng });
      if (Platform.OS === 'ios') {
      this.map.current.fitToCoordinates(latLng, { edgePadding: { top: 40, bottom: 40, left: 40, right: 40 }
      });
    }
      console.log(points);
    } catch (err) {
      console.error(err);
    }
  }

  getUserPosition() {
    this.setState({ hasMapPermission: true });
    this.locationWatchId = navigator.geolocation.watchPosition(
      pos => {
        this.setState({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude
        });
      },
      err => console.warn(err),
      {
        enableHighAccuracy: true
      }
    );
  }

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // this.setState({hasMapPermission: true });
          this.getUserPosition();
        }
      } else {
        // this.setState({ hasMapPermission: true })
        this.getUserPosition();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    const { desinationCoords, userLatitude, userLongitude, hasMapPermission } = this.state;
    let polyline = null;
    let marker = null;
    if(desinationCoords.length > 0) {
        polyline = ( 
        <Polyline
          coordinates={desinationCoords}
          strokeWidth={4}
          strokeColor="#33acff"
        />
      );
        marker = (
           <Marker coordinate={desinationCoords[desinationCoords.length - 1 ]} />
        );
    } 
    if (this.state.hasMapPermission) {
      return (
      <TouchableWithoutFeedback onPress={this.hideKeyboard}>
        <View style={styles.container}>
          <MapView
            ref={this.map}
            showsUserLocation
            followsUserLocation
            style={styles.map}
            region={{
              latitude: userLatitude,
              longitude: userLongitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            {polyline}
            {marker}
          </MapView>
          <PlaceInput
            showDirectionsOnMap={this.showDirectionsOnMap}
            userLatitude={userLatitude}
            userLongitude={userLongitude}
          />
        </View>
      </TouchableWithoutFeedback>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
