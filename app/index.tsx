import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  SafeAreaView,
} from "react-native";
import CheckBox from "expo-checkbox";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";

export default function LogIn() {
  const router = useRouter();
  const navigation = useNavigation();

  // State variables for form inputs

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [textColor, setTextColor] = useState("black");
  const [phoneTextColor, setPhoneTextColor] = useState("black");

  navigation.setOptions({ headerShown: false });

  // List of countries for phone number (Canada only)
  const countriesList = [
    {
      name: "Canada",
      iso2: "ca",
      dialCode: "1",
      priority: 0,
      areaCodes: null,
    },
  ];

  // Function to validate email input
  const handleEmail = () => {
    // format for email: characters@characters.characters
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormat.test(email) === false) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Function to validate password input
  const handlePassword = () => {
    // password must contain at least one number
    let numberCheck = /\d/;

    //password must contain uppercase letter
    let upperCaseCheck = /[A-Z]/;

    //password must contain lowercase letter
    let lowerCaseCheck = /[a-z]/;

    //password must contain special character
    let specialCharCheck = /[!@#$%^&*_]/;

    // password must be at least 8 characters long
    if (password.length < 8) {
      setPasswordError("Incorrect Password");
    }

    // password must contain at least one number
    else if (numberCheck.test(password) === false) {
      setPasswordError("Password must contain at least one number");
    }

    // password must contain at least one uppercase letter
    else if (upperCaseCheck.test(password) === false) {
      setPasswordError("Password must contain at least one uppercase letter");
    }

    // password must contain at least one lowercase letter
    else if (lowerCaseCheck.test(password) === false) {
      setPasswordError("Password must contain at least one lowercase letter");
    }

    // password must contain at least one special character
    else if (specialCharCheck.test(password) === false) {
      setPasswordError("Password must contain at least one special character");
    }

    // password is valid
    else {
      setPasswordError("");
    }
  };

  // Function to handle registration
  const handleLogin = async () => {
    // format for email: characters@characters.characters
    var emailError = "";
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormat.test(email) === false) {
      emailError = "Please enter a valid email address";
    }

    var passwordError = "";
    // password must contain at least one number
    let numberCheck = /\d/;

    //password must contain uppercase letter
    let upperCaseCheck = /[A-Z]/;

    //password must contain lowercase letter
    let lowerCaseCheck = /[a-z]/;

    //password must contain special character
    let specialCharCheck = /[!@#$%^&*_]/;

    // password must be at least 8 characters long
    if (password.length < 8) {
      passwordError = "Password must be at least 8 characters long";
    }

    // password must contain at least one number
    else if (numberCheck.test(password) === false) {
      passwordError = "Password must contain at least one number";
    }

    // password must contain at least one uppercase letter
    else if (upperCaseCheck.test(password) === false) {
      passwordError = "Password must contain at least one uppercase letter";
    }

    // password must contain at least one lowercase letter
    else if (lowerCaseCheck.test(password) === false) {
      passwordError = "Password must contain at least one lowercase letter";
    }

    // password must contain at least one special character
    else if (specialCharCheck.test(password) === false) {
      passwordError = "Password must contain at least one special character";
    }

    if (emailError != "" || passwordError != "") {
      alert(`Failed Validations: \n ${emailError} \n ${passwordError}`);
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert(
        "Sign up failed - please check if entered email and password are correct"
      );
      console.log(err.message);
      return;
    }
  };

  // Return the sign up form
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/1Point_Logo.png")}
          style={styles.headerImage}
        />
      </View>

      <Text style={styles.title}>Log In</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="email"
            size={24}
            color="black"
          />
          <TextInput
            accessibilityLabel="email input"
            placeholder="Email"
            style={styles.input}
            onChangeText={setEmail}
          />
        </View>

        {emailError !== "" && (
          <Text style={{ color: "red" }}>{emailError}</Text>
        )}

        <View style={styles.inputWrapper}>
          <FontAwesome5
            style={styles.icon}
            name="key"
            size={24}
            color="black"
          />
          <TextInput
            accessibilityLabel="password input"
            placeholder="Password"
            secureTextEntry={true}
            style={styles.input}
            onChangeText={setPassword}
          />
        </View>

        {passwordError !== "" && (
          <Text style={{ color: "red" }}>{passwordError}</Text>
        )}
      </View>
      <TouchableOpacity
        accessibilityLabel="forgot password"
        style={styles.forgotPasswordText}
        onPress={() => router.navigate("/forgot_password")}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityLabel="signup button"
        style={styles.signUpButton}
        onPress={handleLogin}
      >
        <Text style={styles.signUpButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Don't have an account?</Text>
        <TouchableOpacity
          accessibilityLabel="register button"
          onPress={() => router.navigate("/signup")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Copyright © 1Point 2024</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 10,
  },
  headerImage: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  loginText: {
    marginBottom: 10,
    marginTop: 20,
  },
  forgotPasswordText: {
    marginBottom: 10,
    textAlign: "right",
    width: "100%",
    color: "blue",
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    alignItems: "center",
    width: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  tcText: {},
});
