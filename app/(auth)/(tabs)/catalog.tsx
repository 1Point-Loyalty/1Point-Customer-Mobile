import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Button, ScrollView, Modal } from 'react-native';
import PagerView from 'react-native-pager-view';
import auth from '@react-native-firebase/auth';
import { useNavigation } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {

  type typeBusiness = {
    id: string,
    name: string,
    address: string,
    phoneNumber: string,
    website: string,
    bio: string,
    logoURL: string,
    type: string,
    pointsPerDollar: number,
    status: string,
    ongoingOffers: number
  }

  const [merchants, setMerchants] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState<typeBusiness | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);

  useEffect(() => {
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    try {
      const user = auth().currentUser;
      const userId = user?.uid;
      const token = await user?.getIdToken(); // Retrieve the token from storage

      const apiURL = `https://admin.1-point.ca/api/getMerchants`;
      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      setMerchants(data)
      
    } catch (error) {
      console.error("Error fetching merchant information:");
    }
  };

  // Render the points section
  const renderBusinessCatalog = () => {

    return (
      <View style={styles.catalogSection}>
        {merchants.map((item: typeBusiness, index) => (
          item.status === 'ACTIVE' && (
            <TouchableOpacity key={item.id || index} onPress={() => setSelectedBusiness(item)}>
              <View style={styles.row}>
                {item.ongoingOffers > 0 && (
                  <View style={styles.offerBadge}>
                    <Text style={styles.offerText}>OFFER</Text>
                  </View>
                )}
                {item.logoURL && (
                <Image
                  source={{ uri: item.logoURL }}
                  style={styles.businessLogo}
                />
              )}
                <View style={styles.infoContainer}>
                  <Text style={styles.type}>Type: {item.type}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.pointsPerDollar && (
                    <Text style={styles.pointsPerDollar}>
                      Points Rate: {item.pointsPerDollar} per $1
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        ))}
          <Modal
            visible={!!selectedBusiness}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setSelectedBusiness(null)
            }
            }
          >
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
              <TouchableOpacity onPress={() => {
                  setSelectedBusiness(null) 
                  setShowCoupons(false)}
                } style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {selectedBusiness && (
                <>
                  {selectedBusiness.logoURL && (
                    <Image
                      source={{ uri: selectedBusiness.logoURL }}
                      style={styles.modalBusinessLogo}
                    />
                  )}
                  <Text style={styles.detailsName}>{selectedBusiness.name}</Text>
                  {selectedBusiness.pointsPerDollar && (
                    <Text style={styles.modalPointsPerDollar}>
                      {selectedBusiness.ongoingOffers > 0
                        ? `PROMOTIONAL POINTS RATE: ${selectedBusiness.pointsPerDollar} per $1`
                        : `Points Rate: ${selectedBusiness.pointsPerDollar} per $1`
                      }
                    </Text>
                  )}
                  <Text style={styles.sectionTitle}>ABOUT:</Text>
                  {selectedBusiness.type && <Text style={styles.sectionText}>{selectedBusiness.type}</Text>}
                  {selectedBusiness.bio && <Text style={styles.sectionText}>{selectedBusiness.bio}</Text>}

                  <Text style={styles.sectionTitle}>ADDRESS:</Text>
                  {selectedBusiness.address && <Text style={styles.sectionText}>{selectedBusiness.address}</Text>}

                  <Text style={styles.sectionTitle}>Contact Information:</Text>
                  {selectedBusiness.phoneNumber && <Text style={styles.sectionText}>{selectedBusiness.phoneNumber}</Text>}
                  {selectedBusiness.website && <Text style={styles.sectionText}>{selectedBusiness.website}</Text>}
                </>
              )}

            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  };

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
            <Text style={styles.welcomeText}>Business Catalog</Text>
          </View>
        </View>
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer}> 
            {(merchants.length>0)  && renderBusinessCatalog()}
          </ScrollView>
        </View>
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
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 71,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrCode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 32,
    justifyContent: 'center',
    margin: 5,
    position: 'relative',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  detailsImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pointsPerDollar: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  }, 
  modalPointsPerDollar: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    fontWeight: 'bold',
  },

  offerBadge: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    position: 'absolute',
    right: 15,
    top: 15,
  },
  offerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lower: {
    flex: 1,
    paddingTop: 200,
    borderRadius: 32,
    backgroundColor: '#ggg',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
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
  modalBusinessLogo: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    borderRadius: 50, // Make it circular if desired
    marginBottom: 10,
  },
  businessLogo: {
    width: 50,  // Adjust size as needed
    height: 50, // Adjust size as needed
    borderRadius: 25, // Make it circular if desired
    marginRight: 10,
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    color: '#555',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  pointAmounts: {
    width: 46,
    height: 46,
    marginRight: 10,
  },
  newBrandLogo: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
    margin: 5,
  },
  newLabelContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'black',
    borderRadius: 32,
  },
  newLabel: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  pointsSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    paddingBottom: 50,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  catalogSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    paddingBottom: 50,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  couponText: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  couponContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  coupon: {
    alignItems: 'center',
    marginBottom: 20,
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
    alignItems: 'center',
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
});