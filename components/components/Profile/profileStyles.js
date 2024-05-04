import { StyleSheet } from 'react-native';

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', 
  },
  message: {
    fontSize: 16,
    color: '#333', 
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: '#1E7B67',
    borderRadius: 1000,
    borderWidth: 3,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderBottomColor: '#1EBB67',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopStartRadius: 600,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    minHeight: 100,
  },
  button: {
    backgroundColor: '#1E7B67',
    borderRadius: 1000,
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50, 
  },
});

export default profileStyles;
