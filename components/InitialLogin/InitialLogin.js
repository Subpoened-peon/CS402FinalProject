import React, {useState} from 'react';
import {View, TextInput, Button, TouchableOpacity, Text, Alert} from 'react-native';
import styles from './InitialLoginStyles';

async function loadUsers(aurl, setUserList) {
  try {
    console.log('loading users...');
    const response = await fetch(aurl);
    const users = await response.json();
    setUserList(users);
    console.log('Users loaded:', users);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function registerUser(aurl, newUser) {
  try {
    const requestOptions = {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newUser)
    };
    const response = await fetch(aurl, requestOptions);
    const data = await response.json();
    console.log(data); 
    console.log("save worked");
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

const InitialLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userList, setUserList] =
useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const registrationHandler = () => {

    if (password.trim() === '') {
    Alert.alert('Please enter a password');
    return;
  }

  if (userName.trim() === '') {
    Alert.alert('Please enter a user name');
    return;
  }

    const loadAddress = "https://cs.boisestate.edu/~scutchin/project/loadjson.php?user=FishRecorder11";

    loadUsers(loadAddress, setUserList);

    const existingUser = userList.some(user => user.userName === userName);
  if (existingUser) {
    Alert.alert('This username is taken.');
    return;
  }

    const saveAddress = "https://cs.boisestate.edu/~scutchin/project/savejson.php?user=FishRecorder11";

  try {
    const newUser = { userName: userName, password: password };
    const response = registerUser(saveAddress, newUser);
    setLoggedInUser(userName);
    console.log(response);
    Alert.alert('User registered successfully');
  } catch (error) {
    Alert.alert('Failed to register user:', error);
  }


  };


  const loginHandler = async () => {
    if (password.trim() === '') {
    Alert.alert('Please enter a password');
    return;
  }

  if (userName.trim() === '') {
    Alert.alert('Please enter a user name');
    return;
  }

    const loadAddress = "https://cs.boisestate.edu/~scutchin/project/loadjson.php?user=FishRecorder11";

    try {
    await loadUsers(loadAddress, setUserList); // Wait for user list to be loaded
    const existingUser = userList.some(user => user.userName === userName);
    
    if (existingUser) {
      if (existingUser.password === password) {
        setLoggedInUser(userName);
        Alert.alert('Login successful');
      } else {
        Alert.alert('Incorrect password');
      }
    } else {
      Alert.alert('User not found');
    }
  } catch (error) {
    Alert.alert('Error logging in:', error.message);
  }
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
