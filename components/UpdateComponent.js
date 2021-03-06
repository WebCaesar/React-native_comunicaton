import React, { Component } from 'react';

import firebase from '../config/firebase';
import { Alert, Button, ActivityIndicator, View, StyleSheet, TextInput, ScrollView } from 'react-native';


class UpdateComponent extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      designation: '',
      isLoading: true
    };
  }
 
  componentDidMount() {
    const docRef = firebase.firestore().collection('students').doc(this.props.route.params.userkey)
    docRef.get().then((res) => {
      if (res.exists) {
        const user = res.data();
        this.setState({
          key: res.id,
          name: user.name,
          designation: user.designation,
          isLoading: false
        });
      } else {
        console.log("No document found.");
      }
    });
  }

  inputEl = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  editStudent() {
    this.setState({
      isLoading: true,
    });
    const docUpdate = firebase.firestore().collection('students').doc(this.state.key);
    docUpdate.set({
      name: this.state.name,
      designation: this.state.designation,
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        designation: '',
        isLoading: false,
      });
      this.props.navigation.navigate('ReadComponent');
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isLoading: false,
      });
    });
  }

  deleteStudent() {
    const docRef = firebase.firestore().collection('students').doc(this.props.route.params.userkey)
      docRef.delete().then((res) => {
          console.log('Doc deleted.')
          this.props.navigation.navigate('ReadComponent');
      })
  }

  alertDialog=()=>{
    Alert.alert(
      'Delete',
      'Really?',
      [
        {text: 'Yes', onPress: () => this.deleteStudent()},
        {text: 'No', onPress: () => console.log('Item not deleted'), style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="red"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.formEl}>
          <TextInput
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(val) => this.inputEl(val, 'name')}
          />
        </View>
        <View style={styles.formEl}>
          <TextInput
              multiline={true}
              placeholder={'Designation'}
              numberOfLines={5}
              value={this.state.designation}
              onChangeText={(val) => this.inputEl(val, 'designation')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Update'
            onPress={() => this.editStudent()} 
            color="green"
          />
          </View>
         <View>
          <Button
            title='Delete'
            onPress={this.alertDialog}
            color="red"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  formEl: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  loader: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',    
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  button: {
    marginBottom: 8, 
  }
})

export default UpdateComponent;