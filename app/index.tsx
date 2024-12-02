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
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";

export default function SignUp() {
  const router = useRouter();
  const navigation = useNavigation();

  // State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");



  // Function to validate password input
  const handlePassword = () => {
    // password must contain at least one number
    let numberCheck = /\d/;


    //password must contain special character
    let specialCharCheck = /[!@#$%^&*_]/;

    // password must be at least 8 characters long
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");


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

  const handlePhoneNumber = () => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (phonePattern.test(phoneNumber) === false) {
      setPhoneTextColor("red");
    } else {
      setPhoneTextColor("black");
    }
  };

  // Function to handle registration
  const handleRegister = () => {
    handleFullName();
    handlePhoneNumber();
    handleEmail();
    handlePassword();
    handleTerms();
  };

  const signUp = async () => {
    if (!email || !password) {
        alert("Email and password must not be empty.");
        return;
    }

    try {
        await auth().createUserWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Sign in failed: " + err.message);
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

      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome
            style={styles.icon}
            name="user-circle-o"
            size={24}
            color="black"
          />
          <TextInput
            accessibilityLabel="name input"
            placeholder="Full Name"
            style={styles.input}
            onChangeText={setFullName}
          />
        </View>
        {fullNameError !== "" && (
          <Text style={{ color: "red" }}>{fullNameError}</Text>
        )}

        <View style={styles.inputWrapper}>
          <PhoneInput
            style={styles.input}
            initialCountry="ca"
            countriesList={countriesList}
            textProps={{
              placeholder: "Phone Number",
              value: phoneNumber,
              onChangeText: handlePhoneNumberChange,
              placeholderTextColor: phoneTextColor,
            }}
            textStyle={{ color: phoneTextColor }}
          />
        </View>

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

        <View style={styles.inputWrapper}>
          <CheckBox
            accessibilityLabel="terms of service checkbox"
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />

          <TouchableOpacity onPress={() => Linking.openURL('https://1-point.ca/page/tc')}>
            <Text
              style={{
                marginLeft: 8,
                textDecorationLine: "underline",
                color: textColor,
              }}
            >
              I agree to the terms of service.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        accessibilityLabel="signup button"
        style={styles.signUpButton}
        onPress={signUp}
      >
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity
          accessibilityLabel="login button"
          onPress={() => router.navigate("/home")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
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
