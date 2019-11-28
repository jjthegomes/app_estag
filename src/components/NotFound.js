import React, { Component } from "react";
import { Text, View, Image } from "react-native";

export class NotFound extends Component {
  render() {
    return (
      <View>
        <Image
          source={require("../assets/notFound.png")}
          style={{ width: 300, height: 250 }}
        />
      </View>
    );
  }
}

export default NotFound;
