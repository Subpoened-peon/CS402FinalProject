import { StyleSheet } from 'react-native';

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Background color for the profile container
  },
  message: {
    fontSize: 16,
    color: '#333', // Text color for the message
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
  button: {
    backgroundColor: '#1E7B67',
    borderRadius: 1000,
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default profileStyles;
