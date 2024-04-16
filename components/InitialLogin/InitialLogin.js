import React, {useState} from 'react';
import {View, TextInput, Button, TouchableOpacity, Text} from 'react-native';
import styles from './InitialLoginStyles';

const InitialLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const registrationHandler = () => {

  }

  const loginHandler = () => {

  }

  return (
    <View style = {styles.container}>
      <TextInput style = {styles.input}
        placeholder = "Username"
        value = {userName}
        onChangeText = {text => setUserName(text)}
      />
      <TextInput style = {styles.input}
        placeholder = "Password"
        value = {password}
        secureTextEntry = {true}
        onChangeText = {text => setPassword(text)}
      />
      <View style = {styles.buttonContainer}>
        <TouchableOpacity onPress = {registrationHandler} style = {styles.button}>
          <Text style = {styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {loginHandler} style = {styles.button}>
          <Text style = {styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InitialLogin;