import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput } from 'react-native'
import axios from 'axios';

export default class PlaceInput extends Component {

    async getPlaces(input) {
        const result = await axios.get(
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyA0GCw9Vtqr7arl8J1S-UhlK-tvs0pWjsc&input=Mcdonalds&location=39.850064, -86.053082&radius=2000"
        );
        console.log(result.data);
    }

  render() {
    return (
         <TextInput onChangeText={(input) => this.getPlaces(input)}
     style={styles.placeInputStyle} 
     placeholder="where to?" 
     />
    );
  }
}

const styles = StyleSheet.create({
    placeInputStyle: {
        height: 40,
        marginTop: 50,
        padding: 5, 
        backgroundColor: "white"
    }
});
