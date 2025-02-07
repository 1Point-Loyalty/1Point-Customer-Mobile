import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, Image, SafeAreaView, Button, TextInput, TouchableOpacity } from 'react-native';
import React, {useCallback, useEffect, useRef, useState } from "react";
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';
import moment from "moment";
import auth from "@react-native-firebase/auth";

export default function TransactionScreen() {
  

  const [loading, setLoading] = useState(true);

  type transaction = {
    transactionAmount: string,
    transactionLocation: string,
    customerID: string, 
    transactionDate:string,
    transactionType: string,
    imageUri: string,
  }
  
  const [transactionData, setTransactionData] = useState<transaction[]>([]);



  const fetchData = useCallback (async () => {
    setLoading (true);
    const user = auth().currentUser;
    const userId = user?.uid;

    const token = await user?.getIdToken();

    fetch (`https://admin.1-point.ca/api/getUserTransactions/${userId}`, {
      method: "GET",
      headers:{
        "Content-Type":"application/json",
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
        //console.log("Fetched Transactions: ", data);
        const formattedData: transaction[] = data.map((transaction: { pointsEquivalent: string; merchant_name: string; createdAt: string; type: string; logoURL: string; userID: string; }) => ({
          transactionAmount: transaction.pointsEquivalent,
          transactionLocation: transaction.merchant_name,
          transactionDate: moment(transaction.createdAt).format("YYYY/MM/DD"),
          transactionType: transaction.type,
          imageUri: transaction.logoURL,
          customerID: transaction.userID,
      }));
        //console.log("formatted transactions: ", formattedData);
        setTransactionData(formattedData);
      })
      .catch((error) =>{
        alert (`Error: ${error.message}`);
        console.error(error);
      });

    await new Promise((r) => setTimeout(r,2000));
    setLoading(false);      
  }, []);

  useEffect(() =>{
    setLoading(true);
    fetchData();
    const autoRefresh = setInterval(fetchData, 60000);

    return() => clearInterval(autoRefresh);
  }, [fetchData]);


  const TransactionRow = ({transactionAmount, transactionLocation, transactionDate, imageUri, transactionType} : {transactionAmount: string, transactionLocation: string, transactionDate: string, imageUri: string, transactionType: string}) => {
    return(
      <View style={styles.transactionPanels}>
        <View style={[styles.sliderSection, styles.shadowProp]}>
            <View>
              <Image            
              source={{uri: imageUri}}
              style={styles.imageContainer}/>
            </View>

            <View style={styles.contentContainerWhole}>
              <View style={{paddingVertical : 5}}>
                <Text style={styles.businessContainer}>{transactionLocation}</Text>
              </View>
              <View style={styles.contentContainer}>
                <Text style={[styles.labelContainer]}>
                  {transactionType === "redemption"
                  ? `Redeemed: ${transactionAmount}`
                  : `Collected: ${transactionAmount}`}
                </Text>
              </View>
              <View style={styles.contentContainer}>
                <Text style={[styles.labelContainer]}>
                    {'Date: '+ transactionDate}
                </Text>
              </View>
            </View>
          </View>
      </View>      
    )
  }

  const mapTransactions = () => {
    return(
      <View>
        {transactionData.map((i, index) => {
          return (
            <TransactionRow
              key={index}
              transactionAmount={i.transactionAmount}
              transactionDate={i.transactionDate}
              transactionLocation={i.transactionLocation}
              imageUri = {i.imageUri}
              transactionType = {i.transactionType}
            />
          );
        })}
      </View>
    )
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
            <Text style={styles.welcomeText}>Transaction History</Text>
          </View>
        </View>
      </View>


      <ScrollView style={styles.mainContainer}>
       <View style={{paddingBottom:120}}>
        {mapTransactions()}
       </View>
      </ScrollView>
      
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
    flex: 0,
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
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  //-------------- Transaction Section styling -----------------
  mainContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: 30,
    paddingTop: 20,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
  },
sliderSection: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderRadius: 26,
  margin: 5,
  position: 'relative',
  minHeight: 100,
},

shadowProp: {
  shadowColor: '#171717',
  shadowOffset: {width: -2, height: 4},
  shadowOpacity: 0.15,
  shadowRadius: 3,
},

imageContainer: {
  width: 71,
  height: 71,
  marginRight: 20,
  justifyContent: 'center',
  alignItems: 'center',
  color: '#FFFFFF',
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  borderBottomLeftRadius: 15,
  borderBottomRightRadius: 15,
},
contentContainerWhole: {
  flexDirection: 'column',
  justifyContent: 'center',
  width: '70%',
  padding: 5,
},
businessContainer: {
  backgroundColor: 'green',
  color: 'white',
  textAlign: 'center',
  borderRadius: 26,
  fontSize: 22,
  width: '100%',
  fontWeight:"bold"
},
contentContainer: {
  flexDirection: 'row',
  paddingVertical: 5,
  width: '100%',
},
labelContainer: {
  backgroundColor: 'lightgrey',
  color: 'black',
  textAlign: 'center',
  borderRadius: 26,
  fontSize: 16,
  width: '100%'
},
transactionPanels:{
  backgroundColor:'white', 
  borderTopLeftRadius: 46, 
  borderTopRightRadius: 46, 
  borderBottomRightRadius: 46, 
  borderBottomLeftRadius: 46, 
  paddingBottom: 5, 
  marginBottom:10
}
});
