import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.main}>

      <View style={styles.container}>

        <View style={styles.header}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome John!</Text>
          </View>
        </View>

        <View style={styles.newSection}>
          <Image
            source={{
              uri: 'https://scontent.fyto3-1.fna.fbcdn.net/v/t39.30808-6/340850073_613777563957043_736834641686291111_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=TnqtXSuKsYkQ7kNvgEKIEjH&_nc_ht=scontent.fyto3-1.fna&oh=00_AYA-_g_ffcBLTXPBCVp5yxLBhdNhviGXmx5GftiHU1S96w&oe=66A89B95'
            }}
            style={styles.newBrandLogo}
          />
          <View style={styles.newLabelContainer}>
            <Text style={styles.newLabel}>NEW</Text>
          </View>
          <Text style={styles.newText}>Shawerma Plus has joined 1Point!</Text>
        </View>

      </View>

      <View style={styles.lower}>

        <View style={styles.pointsSection}>

          <View style={styles.row}>
            <Text style={styles.label}>Current Point Balance:</Text>
            <View style={styles.pointContainer}>
              <Image
                source={require('@/assets/images/1Point_Logo.png')}
                style={styles.pointAmounts}
              />
              <Text style={styles.pointText}>1,978</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Points Collected:</Text>
            <View style={styles.pointContainer}>
              <Image
                source={require('@/assets/images/1Point_Logo.png')}
                style={styles.pointAmounts}
              />
              <Text style={styles.pointText}>34,909</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Transaction:</Text>
            <Text style={styles.transactionText}>July 7th, 2024</Text>
          </View>

        </View>
      </View>
    </View>
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
  lower: {
    flex: 1,
    paddingTop: 40,
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
    marginBottom: 20,
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
    width: 46,
    height: 46,
    marginRight: 10,
  },
  newBrandLogo: {
    width: 113,
    height: 113,
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
});