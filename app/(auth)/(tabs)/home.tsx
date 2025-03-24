import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Button,
} from "react-native";
import PagerView from "react-native-pager-view";
import auth from "@react-native-firebase/auth";
import ContentLoader, { Rect } from "react-content-loader/native";
import moment from "moment";

export default function HomeScreen() {
  // Array of pages to display
  const pages = [
    {
      key: "1",
      imageUri:
        "https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg",
      text: "Shawerma Plus has joined 1Point!",
    },
    {
      key: "2",
      imageUri:
        "https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg",
      text: "Williams Fresh Cafe has joined 1Point!",
    },
    {
      key: "3",
      imageUri:
        "https://downtownkelowna.com/wp-content/uploads/2024/01/340612243_1373366376836948_2942410418678137236_n.jpg",
      text: "D Spot has joined 1Point!",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const pagerRef = useRef<PagerView>(null); // Reference to the pager view
  const totalPages = pages.length; // Total number of pages
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    createdAt: "",
    currentPoints: 0,
    totalPoints: 0,
    mostRecentTransaction: "",
  });

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
        setUserData(formattedData);
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

  // Auto-scroll every 4 seconds to the next page in the list of pages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        // Calculate the next page to display
        const nextPage = (prevPage + 1) % totalPages;
        // If the pagerRef is available, set the page to the next page
        if (pagerRef.current) {
          pagerRef.current.setPage(nextPage);
        }
        // Return the next page
        return nextPage;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Render the NEW section pages
  const renderPages = () => {
    return (
      // Use the PagerView component to display the pages
      <PagerView
        style={styles.page}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {pages.map((page) => (
          <View style={styles.newSection} key={page.key}>
            {page.imageUri ? (
              <Image
                source={{ uri: page.imageUri }}
                style={styles.newBrandLogo}
              />
            ) : null}
            {page.imageUri ? (
              <View style={styles.newLabelContainer}>
                <Text style={styles.newLabel}>NEW</Text>
              </View>
            ) : null}
            <Text style={styles.newText}>{page.text}</Text>
          </View>
        ))}
      </PagerView>
    );
  };

  // Render the dots to indicate the current page
  const renderPageDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  // Render the points section
  const renderPointsSection = () => {
    return (
      <View>
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
                  viewBox="100 0 200 30"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <Rect x="0" y="0" rx="5" ry="5" width="200" height="30" />
                </ContentLoader>
              ) : (
                <Text style={styles.pointText}>{userData.currentPoints}</Text>
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
                  viewBox="100 0 200 30"
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
                viewBox="0 0 200 30"
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
    );
  };

  // Render the home screen
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/1Point_Logo.png")}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            {loading ? (
              <Text style={styles.welcomeText}>Welcome!</Text>
            ) : (
              <Text style={styles.welcomeText}>
                Welcome {userData.firstName}!
              </Text>
            )}
          </View>
        </View>
        {renderPages()}
        {renderPageDots()}
      </View>
      <View style={styles.lower}>{renderPointsSection()}</View>
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
  lower: {
    flex: 1,
    paddingTop: 200,
    borderRadius: 32,
    backgroundColor: "#ggg",
    justifyContent: "flex-end",
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
    width: 46,
    height: 46,
    marginRight: 10,
    marginLeft: 10,
  },
  newBrandLogo: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
    margin: 5,
  },
  newLabelContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "black",
    borderRadius: 32,
  },
  newLabel: {
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    flexShrink: 1,
  },
  pointsSection: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    paddingBottom: 50,
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
});
