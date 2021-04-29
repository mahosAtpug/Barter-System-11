import React from "react"
import {View} from "react-native"
import db from "../config"
import firebase from "firebase"
import {Header , Icon , Badge ,} from "react-native-elements"
import {SafeAreaProvider} from "react-native-safe-area-context"

export default class MyHeader extends React.Component {

   constructor(props){
      super(props)
      this.state = {
         value:"",
         userId:firebase.auth().currentUser.email

      }
   }

   getNumberOfUnreadNotifications(){
      db.collection("all_notifications")
      .where("notification_status" , "==" , "Unread")
      .where("targeted_user_id" , "==" , this.state.userId)
      
      .onSnapshot((snapshot)=>{
         var unreadNotification = snapshot.docs.map((doc)=>{
            doc.data()
         })
         this.setState({
            value:unreadNotification.length
         })
      })
   }

   componentDidMount (){
      this.getNumberOfUnreadNotifications()
   }

      BellIconWithBadge = ()=>{
         return(
            <View>

               <Icon name={"bell"} type={"font-awesome"} color={"yellow"} onPress={()=>{
                           this.props.navigation.navigate("Notifications")
                        }} />

               <Badge value={this.state.value} containerStyle={{position:"absolute" , top:-4 , right:-4}} />  
            </View>
         )
      }

      render(){
         return(
            <SafeAreaProvider>
            <Header centerComponent={{text:this.props.title , style:{color:"#90A5A9" , fontSize:20 , fontWeight:"bold"}}} 
                     backgroundColor={"#EAF8FE"} 

                     leftComponent={
                        <Icon name={"bars"} type={"font-awesome"} color={"#696969"} onPress={()=>{
                           this.props.navigation.toggleDrawer()
                           }} 
                        />
      
                     }
                     
                     rightComponent={
                        <this.BellIconWithBadge {...this.props}/>
                     }/>
                     </SafeAreaProvider>
         )
      }
      }