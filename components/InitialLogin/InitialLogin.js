import React, {useState} from 'react';
import {View, TextInput, Button, TouchableOpacity, Text, Alert} from 'react-native';
import styles from './InitialLoginStyles';

const InitialLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({ userName: '', password: '' });

  const registrationHandler = () => {

    var loadAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=ReelUsers22";

    var saveAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=ReelUsers22";

    fetch(loadAddress + '?userName=' + userName)
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        alert('This username is taken.');
      } else if (password) {
        fetch(saveAddress, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: userName,
            password: password,
          }),
      })
      .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('User saved successfully');
          } else {
            alert('Failed to save user');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      } else {
        alert('Please enter a password');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    }); 
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