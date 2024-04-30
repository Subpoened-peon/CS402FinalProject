import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, TouchableOpacity, Text, Alert} from 'react-native';
import styles from './InitialLoginStyles';

async function pullUsers(aUserSet, loadUrl) {
  try {
    const response = await fetch(loadUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userNames = await response.json();

    const newUserList = userNames.map(user => ({
      userName: user.userName,
      password: user.password,
    }));
    aUserSet(newUserList);
  } catch (error) {
    console.error('Error checking username existence:', error);
    throw error;
  }
}


async function addNewUser(saveUrl, userList) {
  try {
    const requestOptions = {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userList)
    };

    const response = await fetch(saveUrl, requestOptions);

    if (!response.ok) {
      throw new Error('Failed to save user data');
    }

    console.log(response);
    console.log("Save operation successful");
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}


const InitialLogin = ({ setIsLoggedIn, setLoggedInUser }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const loadAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=nicmerritt55";
    pullUsers(setUserList, loadAddress);
  }, []);

async function registrationHandler() {
  if (password.trim() === '') {
    Alert.alert('Please enter a password');
    return;
  }

  if (userName.trim() === '') {
    Alert.alert('Please enter a user name');
    return;
  }

  const userExists = userList.some(user => user.userName === userName);

  if(userExists) {
    Alert.alert("Username already exists. Pick another.");
    return;
  }

  const saveAddress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=nicmerritt55";
  const newUser = { userName: userName, password: password };

  const updatedUserList = [...userList, newUser];
  setUserList(updatedUserList);

  await addNewUser(saveAddress, updatedUserList);
  Alert.alert("Successfully registered your account. Welcome!");
  setIsLoggedIn(true);
  setLoggedInUser(user.userName);
}



  async function loginHandler() {
  if (password.trim() === '') {
    Alert.alert('Please enter a password');
    return;
  }

  if (userName.trim() === '') {
    Alert.alert('Please enter a user name');
    return;
  }

  const user = userList.find(user => user.userName === userName);

  if (!user) {
    Alert.alert("User not found. Please register.");
    return;
  }

  if (user.password !== password) {
    Alert.alert("Incorrect password");
    return;
  }

  // Successful login
  Alert.alert("Login successful!");
  setIsLoggedIn(true);
  setLoggedInUser(user.userName);
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