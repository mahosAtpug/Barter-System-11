import React from "react";
import {createDrawerNavigator} from "react-navigation-drawer";
import {AppTabNavigator} from "./AppTabNavigator";
import CustomSideBarMenu from "./customSideBarMenu";
import SettingScreen from "../screens/settingScreen";
import MyDonations from "../screens/myDonation";
import NotificationScreen from "../screens/notificationsScreen"

export const AppDrawerNavigator = createDrawerNavigator({
   
    Home : {
        screen:AppTabNavigator
    },

    Settings : {

        screen:SettingScreen
    },

    Donations : {
        screen : MyDonations
    },

    Notifications : {
        screen:NotificationScreen
    }

 },

 {
    contentComponent : CustomSideBarMenu
 },
 
 {
     initialRouteName : "Home" 
 }


)