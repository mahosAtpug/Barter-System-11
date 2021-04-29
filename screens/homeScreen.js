import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../component/MyHeader';

export default class BookDonateScreen extends Component{
  constructor(){
    super()
    this.state = {
      requestedItemsList : []
    }
  this.requestRef= null
  }

  getRequestedItemsList =()=>{
    this.requestRef = db.collection("requested_items")
    .onSnapshot((snapshot)=>{
      var requestedItemsList = snapshot.docs.map(document => document.data());
      this.setState({
        requestedItemsList : requestedItemsList
      });
    })
  }

  componentDidMount(){
    this.getRequestedItemsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
     <ListItem key={i} bottomDivider>
        <ListItem.Content>
            <ListItem.Title>
                {item.item_name}
            </ListItem.Title>
            <ListItem.Subtitle>
                {item.reason_to_request}
            </ListItem.Subtitle>

            <TouchableOpacity style={styles.button} onPress={()=>{
                  this.props.navigation.navigate("RecieverDetails" , {"details" : item})
              }}>
              <Text style={{color:"white"}}>
                View
              </Text>
            </TouchableOpacity>

            
        </ListItem.Content>
     </ListItem>
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Donate Books" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.requestedBooksList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Requested Books</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedBooksList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
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
  }
})