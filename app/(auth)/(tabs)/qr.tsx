import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import auth from "@react-native-firebase/auth";
import QRCode from "react-native-qrcode-svg";
import moment from "moment";
import ContentLoader, { Rect } from "react-content-loader/native";

export default function TabTwoScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    createdAt: "",
    currentPoints: 0,
    totalPoints: 0,
    mostRecentTransaction: "",
  });

  const [encryptedQRCode, setEncryptedQRCode] = useState("INVALID");

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
        const formattedData = {
          ...data[0],
          createdAt: moment(data[0].createdAt).format("MM/YY"),
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

    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    const autoRefresh = setInterval(fetchData, 60000);

    return () => clearInterval(autoRefresh);
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
            {loading ? (
              <ContentLoader
                speed={1}
                width={120}
                height={120}
                viewBox="0 0 120 120"
                backgroundColor="#242121"
                foregroundColor="#8888"
              >
                <Rect x="5" y="5" rx="5" ry="5" width="120" height="120" />
              </ContentLoader>
            ) : (
              <QRCode
                backgroundColor="transparent"
                value={encryptedQRCode}
                size={120}
                color="white"
              />
            )}
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

            {loading ? (
              <ContentLoader
                speed={1}
                width={200}
                height={25}
                viewBox="100 0 200 30"
                backgroundColor="#242121"
                foregroundColor="#8888"
              >
                <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
              </ContentLoader>
            ) : (
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
            )}
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
                {loading ? (
                  <ContentLoader
                    speed={1}
                    width={200}
                    height={30}
                    viewBox="125 0 200 30"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
                  </ContentLoader>
                ) : (
                  <Text style={styles.pointText}>
                    {userData.currentPoints ? userData.currentPoints : 0}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Points Collected:</Text>

              <View style={styles.pointContainer}>
                <Image
                  source={require("@/assets/images/1Point_Logo.png")}
                  style={styles.pointAmounts}
                />
                {loading ? (
                  <ContentLoader
                    speed={1}
                    width={200}
                    height={30}
                    viewBox="125 0 200 30"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
                  </ContentLoader>
                ) : (
                  <Text style={styles.pointText}>
                    {userData.totalPoints ? userData.totalPoints : 0}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Last Transaction:</Text>
              {loading ? (
                <ContentLoader
                  speed={1}
                  width={200}
                  height={30}
                  viewBox="25 0 200 30"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
                </ContentLoader>
              ) : (
                <Text style={styles.transactionText}>
                  {userData.mostRecentTransaction
                    ? userData.mostRecentTransaction
                    : "N/A"}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  contentLoader: {
    marginVertical: 20,
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
    marginLeft: 10,
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
