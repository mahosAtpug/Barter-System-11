import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginAndSignUp from "./screens/LoginAndSignUp"
import {AppTabNavigator} from "./component/AppTabNavigator"
import {createSwitchNavigator , createAppContainer} from "react-navigation"
import {AppDrawerNavigator} from "./component/AppDrawerNavigator"


export default function App() {
  return (
    < AppContainer />
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SwitchNavigator = createSwitchNavigator({
  Welcome:{screen:LoginAndSignUp},
  Drawer:{screen:AppDrawerNavigator}

  
})

const AppContainer= createAppContainer(SwitchNavigator)

