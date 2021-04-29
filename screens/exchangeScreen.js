import React from "react";
import {TouchableOpacity , Text , Image , StyleSheet , View, TextInput, Alert , Modal, ScrollView , KeyboardAvoidingView } from "react-native"
import db from "../config"
import firebase from "firebase"
import MyHeader from "../component/myHeader"

export default class BookRequestScreen extends React.Component{

    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            itemName:"",
            reasonToRequest:"",
            requestId:"",
            itemStatus:"",
            requestedItemName:"",
            docId:"",
            isItemRequestStatusActive:""
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addRequest = async()=>{
        var randomRequestId  = this.createUniqueId()
        db.collection("requested_items").add({
            user_id:this.state.userId,
            item_name:this.state.itemName,
            reason_to_request:this.state.reasonToRequest,
            request_id:randomRequestId,
            item_status:"Requested"
        })
        await this.getItemRequest()
        db.collection("users").where("email_id" , "==" , this.state.userId).get()
        .then()
        .then((snapshot)=>{
           snapshot.forEach((doc)=>{
              db.collection("users").doc(doc.id).update({
                  isItemRequestStatusActive:true
              })
           }) 
        })

        this.setState({
            itemName:"",
            reasonToRequest:""
        })

        return Alert.alert("Item Request sent Successfully")
        alert("Item Request Sent Successfully")
    }

    getIsItemRequestStatusActive (){
        db.collection("users").where("email_id" , "==" , this.state.userId)
        .onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    isItemRequestStatusActive: doc.data().isItemRequestStatusActive,
                    docId:doc.id
                })
            })
        })
    }

    getItemRequest=()=>{
        var itemRequest = db.collection("requested_items").where("user_id" , "==" , this.state.userId)
        .get()
        .then((snapshot)=>{
           snapshot.forEach((doc)=>{
               if (doc.data().item_status !== "recieved"){
                   this.setState({
                       requestId:doc.data().request_id,
                       requestedItemName : doc.data().item_name,
                       itemStatus : doc.data().item_status,
                       docId: doc.id
                   })
               }
           })
        }) 
    }

    componentDidMount (){
        this.getIsItemRequestStatusActive()
    }
    updateItemRequestStatus = ()=>{
        db.collection("requested_items").doc(this.state.docId).update({
            item_status:"recieved"
        })
        db.collection("users").where("email_id" , "==" , this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id).update({
                    isItemRequestStatusActive:false
                })
            })
        })
    }

    sendNotification = ()=>{
       db.collection("users").where("email_id" , "==" , this.state.userId).get()
       .then((snapshot)=>{
           snapshot.forEach((doc)=>{
               var name = doc.data().first_name  + " " + doc.data().last_name

               db.collection("all_notifications").where("request_id" , "==" , this.state.requestId).get()
                        .then((snapshot)=>{

                snapshot.forEach((doc)=>{
                    var donorId = doc.data().donor_id;
                    var itemName = doc.data().item_name;

                   db.collection("all_notifications").add({
                       targeted_user_id:donorId,
                       message:name + " " + " Recieved The Item " + itemName,
                       notification_status: "Unread",
                       item_name : itemName
                   })
                 })

           })
           })
       })
       
       
    }
    
    

    render(){
        if(this.state.isItemRequestStatusActive === true){
            return(
                    <View style={{flex:1 , justifyContent:"center"}}>
                       <View style={{borderColor:"orange" , borderWidth:2 , justifyContent:"center" , alignItems:"center" , 
                                        padding:10
                                        }}>
                             <Text>
                                 Book Name
                             </Text>
                             <Text>
                                 {this.state.requestedItemName}
                             </Text>

                       </View>
                       <View  style={{borderColor:"orange" , borderWidth:2 , justifyContent:"center" , alignItems:"center" , padding:10}}>

                          <Text>
                              Item Status
                          </Text>
                          <Text>
                              {this.state.itemStatus}
                          </Text>
                       </View>

                       <TouchableOpacity style={{borderWidth:1 , marginTop:10 , alignSelf:"center" ,  borderColor:"orange" , backgroundColor:"orange" , width:300 , alignItems:"center"}}
                                         onPress={()=>{
                                             this.sendNotification();
                                             this.updateItemRequestStatus()
                                         }}>
                           <Text>
                               I Have Recieved The Item
                           </Text>

                       </TouchableOpacity>

                    </View>
            )
        }
        else{

        
        return(
            <View style={{flex:1}}>
                <MyHeader title={"Request Item!"} navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>

                    <TextInput style={styles.formTextInput} placeholder={"Enter Name Of The Item"} 
                        onChangeText={(text)=>{
                            this.setState({
                                itemName:text
                        })
                        }} value={this.state.itemName}
                        />

                    
                    <TextInput style={[styles.formTextInput , {height:300} ]} placeholder={"Enter The Reason To Request The Item"} 
                        onChangeText={(text)=>{
                            this.setState({
                                reasonToRequest:text
                            })
                        }} value={this.state.reasonToRequest}
                        multiLine={true}
                        numberOfLines={8}
                        />

                        <TouchableOpacity style={styles.button} onPress={()=>{
                            this.addRequest()
                         }}>

                            <Text>
                                REQUEST
                            </Text>
                        </TouchableOpacity>

                </KeyboardAvoidingView>
            </View>
        )
    }
}
}
const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )