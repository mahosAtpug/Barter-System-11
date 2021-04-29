import React from "react";
import RecieverDetailsScreen from "../screens/recieverDetailsScreens"
import {createStackNavigator} from "react-navigation-stack"
import HomeScreen from "../screens/homeScreen"

export const AppStackNavigator = createStackNavigator({
    HomeScreenList:{
        screen:HomeScreen,
        navigationOptions:{
            headerShown:false
        }
    },

    RecieverDetails:{
        screen:RecieverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    }
},

{
 initialRouteName:"HomeScreenList"

}

)