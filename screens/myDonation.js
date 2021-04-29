import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../component/MyHeader';

export default class MyDonations extends React.Component{

    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allDonations:[],


        }

        this.requestRef=null
    }

    sendNotifications = (itemDetails , requestStatus)=>{
        var requestId = itemDetails.request_id
        var donorId = itemDetails.donor_id

        db.collection("all_notifications").where("request_id" , "==" , requestId).where("donor_id" , "==" , donorId)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
              var message = ""
              if (requestStatus==="Item Sent"){
                  message=this.state.donorName + " Has Sent You An Item" 
              }
              else{
                  message=this.state.donorName + " Has Shown Interest In Donating An Item"
              }

              db.collection("all_notifications").doc(doc.id).update({
                  message:message,
                  notification_status:"Unread",
              })
          })
        })
    }


    sendItem=(itemDetails)=>{
       if(itemDetails.request_status === "Item Sent"){
           var requestStatus = "Item Sent"
           db.collection("all_donations").doc(itemDetails.doc_id).update({
               request_status:requestStatus 
           })
           this.sendNotifications(itemDetails , requestStatus)
       }
    
        else{
           var requestStatus = "Donor Interested"
           db.collection("all_donations").doc(itemDetails.doc_id).update({
               request_status:requestStatus
           })

           this.sendNotifications(itemDetails, requestStatus)
        }
    }

    

    getAllDonations = ()=>{
        this.requestRef = db.collection("all_donations").where("donor_id" , "==" , this.state.userId)

        .onSnapshot((snapshot)=>{
            var allDonations = snapshot.docs.map(document => document.data())

            this.setState({
                allDonations:allDonations
            })
        })
    }

    componentDidMount (){
        this.getAllDonations()
        this.getDonorDetails()
    }

    keyExtractor =(item,index) => {index.toString()}

    renderItem = ({item , i})=>{

        return(
            <ListItem key={i} bottomDivider={true}>
               <ListItem.Content>
                  <ListItem.Title>
                      {item.item_name}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                      {"Requested By: " + item.requested_by + "\n status: " + item.request_status}
                  </ListItem.Subtitle>

                   <TouchableOpacity style={styles.button} onPress={()=>{
                       this.sendItem(item)
                   }}>
                       <Text >
                           {
                             item.request_status==="Item Sent"?
                             "Item Sent"
                             :"Send Item"
                           }
                       </Text>
                   </TouchableOpacity>
               </ListItem.Content>
            </ListItem>
        )
    }

    
    getDonorDetails=()=>{
        db.collection("users").where("email_id","==", this.state.userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              "donorName" : doc.data().first_name + " " + doc.data().last_name
            })
          });
        })
      }

    render(){
        return(
            <View style={{flex:1}}>

                <MyHeader title={"My Donations"} navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                      this.state.allDonations.length===0
                      ?(
                          <View style={styles.subtitle}>
                             <Text style={{fontSize:20}}>
                                 List Of Items Donated
                             </Text>
                          </View>
                      ):(
                          <FlatList 
                             keyExtractor={this.keyExtractor}
                             data={this.state.allDonations}
                             renderItem={this.renderItem}/>
                      )
                    }
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        marginLeft:"75%",
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8
         }
      },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })
