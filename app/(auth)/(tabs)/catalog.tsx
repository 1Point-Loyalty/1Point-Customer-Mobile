import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Button, ScrollView, Modal, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
const { width } = Dimensions.get("window");


export default function BusinessCatalog() {

  type typeBusiness = {
    key: string,
    imageUri: string,
    name: string,
    type: string,
    address: string,
    contact: string,
    website: string,
    offer: number,
    bio: string,
  }

  const [merchantData, setMerchantData] = useState<typeBusiness[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<typeBusiness|null>(null);

  type coupon = {
    id: string,
    name: string,
    qrCode: string,
  }

  const fetchMerchants = useCallback(async () => {
    const user = auth().currentUser;

    const token = await user?.getIdToken();

    fetch(`https://admin.1-point.ca/api/getMerchants`, {
      method: `GET`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: any[]) => {
        const formattedMerchants: typeBusiness[] = data.map((business: { merchantId: string, logoURL: string, name: string, type: string, address: string, phoneNumber: string, website: string, offer: number, bio: string }) => ({
          key: business.merchantId,
          imageUri: business.logoURL,
          name: business.name,
          type: business.type,
          address: business.address,
          contact: business.phoneNumber,
          website: business.website,
          offer: business.offer,
          bio: business.bio
        }));
        setMerchantData(formattedMerchants);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error(error);
      })
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  //Reusable component
  const BusinessRow = ({ business }: { business: typeBusiness }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(true)}>
          <View style={styles.card}>
            <Image
              source={{ uri: business?.imageUri }}
              style={styles.imageRow}>
            </Image>
            {business?.offer === 1 && (
              <View style={styles.offerContainer}>
                <Text style={styles.offer}>OFFER AVAILABLE</Text>
              </View>
            )}
            <View style={styles.overlay}>
              <Text style={styles.businessName}>{business?.name}</Text>
              <Text style={styles.businessType}>Fast Food</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Modal Panel Business Profile*/}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{business?.name}</Text>
              <Image source={{ uri: business?.imageUri }} style={styles.modalImage} />
              <View style={styles.modalRowContainer}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="map-marker"
                  size={24}
                  color="black"
                />
                <Text style={styles.modalDescription}>{business?.address}</Text>
              </View>
              <View style={styles.modalRowContainer}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="phone"
                  size={24}
                  color="black"
                />
                <Text style={styles.modalDescription}>{business?.contact}</Text>
              </View>
              <View style={styles.modalRowContainer}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="laptop"
                  size={24}
                  color="black"
                />
                <Text style={styles.modalDescription}>Website {business?.website}</Text>
              </View>
              <Text style={styles.modalDescription}>{business?.bio}</Text>


              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }
  


  const mapBusinesses = () => {
    return (
      <View>
        {merchantData.map((business, index) => {
          return (
            <BusinessRow
              key={index}
              business={business}
            />
          );
        })}
      </View>
    );
  }


  // Render the home screen 
  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>BUSINESS CATALOG</Text>
          </View>
        </View>


        <ScrollView style={styles.mainContainer}>
          <View style={{ paddingBottom: 45 }}>
            {mapBusinesses()}
          </View>
        </ScrollView>

      </View>

    </SafeAreaView >
  );
};


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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  mainContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    paddingTop: 20,
    padding:15,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  imageRow: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    paddingLeft: 15,
  },
  offerContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: 'green'
  },
  offer: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  businessType: {
    fontSize: 14,
    color: "#fff",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  //Styles for the business modals
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 46,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    paddingTop: 20,
    fontWeight: 'bold'
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    
  },
  //BUSINESS PROFILE PAGE STYLES
  image: {
    width: "130%",
    height: "130%",
    marginTop: -30,
    marginLeft: -75,
  },
  orangeOverlay: {
    backgroundColor: "#E95F23",
    width: width * 0.9,
    height: 70,
    borderRadius: 12,
    position: "absolute",
    top: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
});

