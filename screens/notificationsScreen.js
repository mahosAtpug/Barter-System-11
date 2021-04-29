import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../component/MyHeader';
import SwipeableFlatList from "../component/SwipeableFlatList.js"


export default class NotificationsScreens extends React.Component{

    constructor(){
        super()
        this.state={
            userId: firebase.auth().currentUser.email,
            allNotifications:[],

        }
        this.notificationRef=null
    }

    getNotifications=()=>{
        this.notificationRef = db.collection("all_notifications")
        .where("notification_status" , "==" , "Unread")
        .where("targeted_user_id" , "==" , this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_id"] = doc.id
                allNotifications.push (notification)
            })
            this.setState(
                {
                  allNotifications :allNotifications
                }
            )
        })
    }

    componentDidMount (){
        this.getNotifications()
    }

    keyExtractor = (item , index) => {index.toString()}

    renderItem = ({item , i}) =>{

        return (
            <ListItem key={i} bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>
                        {item.item_name}
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        {item.message}
                    </ListItem.Subtitle>
                </ListItem.Content>

            </ListItem>
        )
    }


   render(){
       return(
           <View style={{flex:1}}>

               <View style={{flex:0.1}}>
                    <MyHeader title={"Notifications"} navigation={this.props.navigation} />
               </View>

               <View style={{flex:0.9}}>
                   {
                       this.state.allNotifications.length===0
                       ?(
                           <View>
                              <Text>
                                  You Have No Notifications
                              </Text>
                           </View>
                       ):
                       <SwipeableFlatList allNotifications={this.props.allNotifications}/>
                   }
               </View>
           </View>
       )
   }
}