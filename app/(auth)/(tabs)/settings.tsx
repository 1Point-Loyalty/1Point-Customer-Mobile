import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import ContentLoader, { Rect } from "react-content-loader/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PhoneInput from "react-native-phone-input";
import moment from "moment";

export default function Settings() {
  const router = useRouter();
  const [messageVisible, setMessageVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  const handleChangePassword = () => {
    var user = auth().currentUser;
    var email = "";
    if (user != null && user.email != null) {
      email = user.email;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setMessageVisible(true);
      })
      .catch((error: any) => {
        alert(error);
      });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const user = auth().currentUser;
    const userId = user?.uid;

    const token = await user?.getIdToken();

    fetch(`https://admin.1-point.ca/api/getUser/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // format dates
        const formattedData = {
          ...data[0],
          createdAt: moment(data[0].createdAt).format("MM/YY"),
          // format the most recent transaction date
          mostRecentTransaction: data[0].mostRecentTransaction
            ? moment(data[0].mostRecentTransaction).format("YYYY/MM/DD")
            : null,
        };
        setName(formattedData.firstName + " " + formattedData.lastName);
        setEmail(formattedData.email);
        setPhone(formattedData.phoneNumber);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error(error);
      });

    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    const autoRefresh = setInterval(fetchData, 60000);

    return () => clearInterval(autoRefresh);
  }, [fetchData]);

  const handleUpdateUser = async () => {
    try {
      const user = auth().currentUser;
      const userId = user?.uid;

      const token = await user?.getIdToken();

      const [firstName, lastName] = name.split(" ");

      const updatedUserData = {
        firstName: firstName || "",
        lastName: lastName || "",
        email,
        phoneNumber: phone
      };

      const response = await fetch(`https://admin.1-point.ca/api/editUser/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedUserData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("User updated successfully: ", data);
      alert("User information updated successfully!");

    } catch (error) {
      console.error("Error updating user: ", error);
      //alert(`Error updating user: ${error.message}`);
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      {/* Header */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/1Point_Logo.png")}
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
            <MaterialCommunityIcons
              style={styles.icon}
              name="account"
              size={24}
              color="black"
            />
          </View>
          {loading ? (
            <ContentLoader
              speed={1}
              width={400}
              height={30}
              viewBox="50 0 200 30"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
            </ContentLoader>
          ) : (
            <TextInput
              accessibilityLabel="name"
              placeholder="First Last"
              value={name}
              onChangeText={setName}
              style={styles.input}
            ></TextInput>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.pointContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="email"
              size={24}
              color="black"
            />
          </View>
          {loading ? (
            <ContentLoader
              speed={1}
              width={400}
              height={30}
              viewBox="50 0 200 30"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
            </ContentLoader>
          ) : (
            <TextInput
              accessibilityLabel="email"
              value={email}
              onChangeText={setEmail}
              placeholder="example@gmail.com"
              style={styles.input}
            ></TextInput>
          )}
        </View>

        <View style={styles.row}>
          {loading ? (
            <ContentLoader
              speed={1}
              width={400}
              height={30}
              viewBox="50 0 200 30"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
            </ContentLoader>
          ) : (
            <PhoneInput
              style={styles.input}
              initialCountry="ca"
              initialValue={phone}
              onChangePhoneNumber={setPhone}
            ></PhoneInput>
          )}
        </View>

        <TouchableOpacity
          style={styles.changePassword}
          accessibilityLabel="save changes"
          onPress={handleUpdateUser}
        >
          <Text style={styles.pointText}>Save Changes</Text>
        </TouchableOpacity>

        
        <TouchableOpacity
          style={styles.changePassword}
          accessibilityLabel="change password"
          onPress={handleChangePassword}
        >
          <Text style={styles.pointText}>Change Password</Text>
        </TouchableOpacity>

        {messageVisible && (
          <Text style={styles.changeMessage}>
            An email to change your password has been sent to you!
          </Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          accessibilityLabel="logout"
          onPress={() => auth().signOut()}
        >
          <Text style={styles.backButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 71,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  newSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 32,
    margin: 5,
    position: "relative",
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "bold",
    flexShrink: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  settingsPanel: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 650,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: 10,
    marginVertical: 24,
    minHeight: 75,
  },
  pointContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  page: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#fff",
    maxHeight: 200,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "black",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  changePassword: {
    borderWidth: 1,
    borderColor: "black",
    marginTop: 60,
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  changeMessage: {
    marginTop: 15,
    fontSize: 18,
    color: "black",
    textAlign: "center",
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
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
