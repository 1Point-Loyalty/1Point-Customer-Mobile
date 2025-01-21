import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth";
import QRCode from "react-native-qrcode-svg";
import moment from "moment";

export default function TabTwoScreen() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    createdAt: "",
    currentPoints: 0,
    totalPoints: 0,
    mostRecentTransaction: "",
  });

  const [encryptedQRCode, setEncryptedQRCode] = useState("INVALID");

  // call fetchData every 5 minutes
  const fetchData = useCallback(async () => {
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
        setUserData(formattedData);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error(error);
      });

    fetch(`https://admin.1-point.ca/api/getEncryptedUserDetails/${userId}`, {
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
        setEncryptedQRCode(data);
      })
      .catch((error) => {
        alert(`Error: Failed to create QR code:`);
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchData();
    const autoRefresh = setInterval(fetchData, 60000);

    return () => clearInterval(autoRefresh);
  }, [fetchData]);

  // Render the qr page
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/1Point_Logo.png")}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.titleText}>WALLET</Text>
          </View>
        </View>

        <View style={styles.qrCodeContainer}>
          <View style={styles.qrCode}>
            <QRCode
              backgroundColor="transparent"
              value={encryptedQRCode}
              size={120}
              color="white"
            />
          </View>
          <View style={styles.qrCodeText}>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter",
                fontSize: 26,
                fontWeight: "bold",
              }}
            >
              {userData.firstName.toUpperCase()}
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter",
                fontSize: 26,
                fontWeight: "bold",
              }}
            >
              {userData.lastName.toUpperCase()}
            </Text>
            <Text> </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              MEMBER SINCE: {userData.createdAt}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.lower}>
        <View style={styles.pointsSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Current Point Balance:</Text>

            <View style={styles.pointContainer}>
              <Image
                source={require("@/assets/images/1Point_Logo.png")}
                style={styles.pointAmounts}
              />
              <Text style={styles.pointText}>{userData.currentPoints}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Points Collected:</Text>

            <View style={styles.pointContainer}>
              <Image
                source={require("@/assets/images/1Point_Logo.png")}
                style={styles.pointAmounts}
              />
              <Text style={styles.pointText}>
                {userData.totalPoints ? userData.totalPoints : 0}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Transaction:</Text>
            <Text style={styles.transactionText}>
              {userData.mostRecentTransaction
                ? userData.mostRecentTransaction
                : "N/A"}
            </Text>
          </View>

          <View style={styles.loginContainer}>
            <TouchableOpacity onPress={fetchData} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  qrCodeContainer: {
    backgroundColor: "#242121",
    flexDirection: "row",
    alignItems: "center",
    padding: 30,
    borderRadius: 25,
    justifyContent: "flex-start",
    margin: 5,
    position: "relative",
  },
  qrCode: {
    flexDirection: "column",
    padding: 15,
    justifyContent: "flex-start",
  },
  qrCodeText: {
    flexDirection: "column",
    padding: 5,
    justifyContent: "flex-start",
  },
  lower: {
    flex: 1,
    paddingTop: 100,
    marginTop: 20,
    borderRadius: 32,
    backgroundColor: "#ggg",
    justifyContent: "flex-end",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
  },

  headerImage: {
    width: 71,
    height: 71,
    marginRight: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  pointAmounts: {
    width: 46,
    height: 46,
    marginRight: 10,
  },
  pointsSection: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    paddingBottom: 30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
    marginEnd: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginEnd: 10,
  },
  loginText: {
    marginBottom: 10,
    marginTop: 20,
  },
  loginButton: {
    borderWidth: 1,
    padding: 10,
    borderColor: "black",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
});
