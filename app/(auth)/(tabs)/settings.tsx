import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Button, TextInput, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import auth from '@react-native-firebase/auth';
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";



export default function Settings() {
  const router = useRouter();
  const [messageVisible, setMessageVisible] = useState(false);

  const handleChangePassword = () => {
    setMessageVisible(true);
    

    //Eventually add code here to send email to users
  };

  return (
    <SafeAreaView style={styles.main}>

      {/* Header */}
      <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/1Point_Logo.png')}
              style={styles.headerImage}
            />
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Settings</Text>
            </View>
          </View>
      </View>


      {/*Settings Panel*/}
      <View style={styles.settingsPanel}>

        <View style={styles.row}>
          <View style={styles.pointContainer}>
            <Image
              source={require('@/assets/images/1Point_User.png')}
              style={styles.pointAmounts}
            />
          </View>
          <TextInput accessibilityLabel = "name"
          placeholder = "John Doe"
          style={styles.input}>            
          </TextInput>
        </View>

        <View style={styles.row}>
          <View style={styles.pointContainer}>
            <Image
              source={require('@/assets/images/1Point_Email.png')}
              style={styles.pointAmounts}
            />
          </View>
          <TextInput accessibilityLabel = "email"
          placeholder = "john.doe@gmail.com"
          style={styles.input}>            
          </TextInput>
        </View>

        <View style={styles.row}>
          <View style={styles.pointContainer}>
            <Image
              source={require('@/assets/images/1Point_Number.png')}
              style={styles.pointAmounts}
            />
          </View>
          <TextInput accessibilityLabel = "phone number"
          placeholder = "437-333-9999"
          style={styles.input}>            
          </TextInput>
        </View>

        <TouchableOpacity 
        style={styles.changePassword}
        accessibilityLabel='change password'
        onPress = {handleChangePassword}>
          <Text style={styles.pointText}>Change Password</Text>
        </TouchableOpacity>

        {messageVisible && (
          <Text style={styles.changeMessage}>An email to change your password has been sent to you!</Text>
        )}

        <TouchableOpacity
        style={styles.backButton}
        accessibilityLabel='log out'
        onPress={() => router.navigate("/")}>
          <Text style = {styles.backButtonText}>Log Out</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 71,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 32,
    margin: 5,
    position: 'relative',
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointAmounts: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  newBrandLogo: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
    margin: 5,
  },
  newText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  settingsPanel: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight:650,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 10,
    marginVertical: 24,
    minHeight: 75
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pointText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  page: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  }, 
  input: {
    flex: 1,
    fontSize:16
  },
  changePassword: {
    borderWidth: 1,
    borderColor: "black",
    marginTop:60,
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  changeMessage:{
    marginTop:15,
    fontSize:18,
    color:"black",
    textAlign:"center"
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 50,
    minWidth: "95%",
    margin: 5,
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    marginTop:20
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
