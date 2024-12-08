import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Button, ScrollView, Modal } from 'react-native';
import PagerView from 'react-native-pager-view';
import auth from '@react-native-firebase/auth';
import { useNavigation } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {

  // Array of pages to display
  const pages = [
    {
      key: '1',
      imageUri: 'https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg',
      text: 'Shawerma Plus has joined 1Point!',
    },
    {
      key: '2',
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
      text: 'Williams Fresh Cafe has joined 1Point!',
    },
    {
      key: '3',
      imageUri: 'https://play-lh.googleusercontent.com/Ej7CgScjyiwHdjKHQ0YBgFKbCm73kQUAi0LSiOZO4EKwu_nI7kVD3a8DAqk4evkIYn8',
      text: "Tahini's has joined 1Point!",
    },
  ];

  type typeBusiness = {
    key: string,
    imageUri: string,
    name: string,
    type: string,
    address: string,
    contact: string,
    website: string,
    offer: boolean,
    coupons: coupon[]
  }

  type coupon = {
    id: string,
    name: string,
    qrCode: string,
  }

  const businesses = [
    {
      key: '1',
      imageUri: 'https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg',
      name: 'Shawerma Plus',
      type: "Fast Food",
      address: "123 Test Street",
      contact: "(123) 456 7890",
      website: "123Restaruant.com",
      offer: true,
      coupons: [
        { id: '102', name: '15% Off New Collection', qrCode: 'https://example.com/qr2.png' },
      ]
    },
    {
      key: '2',
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
      name: 'Williams Fresh Cafe!',
      type: "Cafe",
      address: "123 Test Street",
      contact: "(123) 456 7890",
      website: "123Restaruant.com",
      offer: true,
      coupons: [
        { id: '100', name: '10% Off New Collection', qrCode: 'https://example.com/qr2.png' },
        { id: '101', name: '5% Off New Collection', qrCode: 'https://example.com/qr2.png' },
        { id: '100', name: '10% Off New Collection', qrCode: 'https://example.com/qr2.png' },
        { id: '101', name: '5% Off New Collection', qrCode: 'https://example.com/qr2.png' },
        { id: '100', name: '10% Off New Collection', qrCode: 'https://example.com/qr2.png' },
        { id: '101', name: '5% Off New Collection', qrCode: 'https://example.com/qr2.png' },
      ]
    },
    {
      key: '3',
      imageUri: 'https://play-lh.googleusercontent.com/Ej7CgScjyiwHdjKHQ0YBgFKbCm73kQUAi0LSiOZO4EKwu_nI7kVD3a8DAqk4evkIYn8',
      name: "Tahini's!",
      type: "Fast Food",
      address: "123 Test Street",
      contact: "(123) 456 7890",
      website: "123Restaruant.com",
      offer: false,
      coupons: [
      ]
    },
  ]

  const [currentPage, setCurrentPage] = useState(0);  // Track the current page
  const pagerRef = useRef<PagerView>(null); // Reference to the pager view
  const totalPages = pages.length; // Total number of pages

  // Auto-scroll every 4 seconds to the next page in the list of pages 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prevPage => {
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

  // Render the points section
  const renderBusinessCatalog = () => {

    const [selectedBusiness, setSelectedBusiness] = useState<typeBusiness | null>(null);
    const [showCoupons, setShowCoupons] = useState(false);
    return (
      <View style={styles.catalogSection}>
        {businesses.map((item, _) => (
          <TouchableOpacity onPress={() => setSelectedBusiness(item)}>
            <View style={styles.row}>


              <Image source={{ uri: item.imageUri }} style={styles.image} />
              {item.offer && <View style={styles.offerBadge}><Text style={styles.offerText}>OFFER</Text></View>}
              <View style={styles.infoContainer}>
                <Text style={styles.type}>Type: {item.type}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>

              

            </View>
          </TouchableOpacity>
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

              <Image source={{ uri: selectedBusiness?.imageUri }} style={styles.detailsImage} />
              <Text style={styles.detailsName}>{selectedBusiness?.name}</Text>

              <Text style={styles.sectionTitle}>ABOUT:</Text>
              <Text style={styles.sectionText}>{selectedBusiness?.type}</Text>

              <Text style={styles.sectionTitle}>ADDRESS:</Text>
              <Text style={styles.sectionText}>{selectedBusiness?.address}</Text>

              <Text style={styles.sectionTitle}>Contact Information:</Text>
              <Text style={styles.sectionText}>{selectedBusiness?.contact}</Text>
              <Text style={styles.sectionText}>{selectedBusiness?.website}</Text>

              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCoupons(!showCoupons)}
              >
                <Text style={styles.dropdownButtonText}>
                  {showCoupons ? 'Hide Offers' : 'View Offers'}
                </Text>
              </TouchableOpacity>

              {showCoupons && selectedBusiness?.coupons && (
                <View style={styles.couponContainer}>
                  {selectedBusiness.coupons.map((coupon) => (
                    <View key={coupon.id} style={styles.couponCard}>
                      <View style={styles.qrCode}>
                        <QRCode
                          value={coupon.qrCode}
                          size={80}
                          color="black" />
                      </View>
                      <Text style={styles.couponText}>{coupon.name}</Text>
                    </View>
                  ))}
                </View>
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
        {renderBusinessCatalog()}
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
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
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