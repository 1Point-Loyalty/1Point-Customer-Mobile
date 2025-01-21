import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, Image, SafeAreaView, Button, TextInput, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';

export default function TransactionScreen() {
  const transactionArray = [
    {
      transactionAmount: 14000,
      transactionLocation: "Shawerma Plus",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123456789",
      transactionStatus: "Pending",
      imageUri:'https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg',
    },
    {
      transactionAmount: 4000,
      transactionLocation: "William's Fresh Cafe",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123456789",
      transactionStatus: "Pending",
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
    },
    {
      transactionAmount: 12000,
      transactionLocation: "Farah Food Mart",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123456789",
      transactionStatus: "Complete",
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
    },
    {
      transactionAmount: 1000,
      transactionLocation: "Shawerma Plus",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123456789",
      transactionStatus: "Complete",
      imageUri:'https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg',
    },
    {
      transactionAmount: 150000,
      transactionLocation: "Subway",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123456789",
      transactionStatus: "Complete",
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
    },
  ];

  const TransactionRow = ({transactionAmount, transactionLocation, transactionDate, imageUri} : {transactionAmount: number, transactionLocation: string, transactionDate: string, imageUri: string}) => {
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
                  {'Collected: '+ transactionAmount}
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
        {transactionArray.map((transaction) => {
          return (
            <TransactionRow
              transactionAmount={transaction.transactionAmount}
              transactionDate={transaction.transactionDate}
              transactionLocation={transaction.transactionLocation}
              imageUri = {transaction.imageUri}
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
