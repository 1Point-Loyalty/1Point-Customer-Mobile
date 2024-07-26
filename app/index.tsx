import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-input';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';




export default function SignUp() {
    const router = useRouter();
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');

    navigation.setOptions({ headerShown: false });

    const countriesList = [
        {
            name: 'Canada',
            iso2: 'ca',
            dialCode: '1',
            priority: 0,
            areaCodes: null,
        },
    ];

    const formatPhoneNumber = (number: string) => {
        // Remove all non-digit characters
        const cleaned = ('' + number).replace(/\D/g, '');
        // Limit to 10 digits
        const limited = cleaned.substring(0, 10);
        // Format the number with hyphens
        const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return limited;
    };

    const handlePhoneNumberChange = (number: string) => {
        const formattedNumber = formatPhoneNumber(number);
        setPhoneNumber(formattedNumber);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/1Point_Logo.png')}
                    style={styles.headerImage}
                />
            </View>

            <Text style={styles.title}>Register</Text>

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <FontAwesome style={styles.icon} name="user-circle-o" size={24} color="black" />
                    <TextInput placeholder="Full Name" style={styles.input} />
                </View>

                <View style={styles.inputWrapper}>

                    <PhoneInput
                        style={styles.input}
                        initialCountry="ca"
                        countriesList={countriesList}
                        textProps={{
                            placeholder: 'Phone Number',
                            value: phoneNumber,
                            onChangeText: handlePhoneNumberChange,
                        }}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons style={styles.icon} name="email" size={24} color="black" />
                    <TextInput placeholder="Email" style={styles.input} />
                </View>

                <View style={styles.inputWrapper}>
                    <FontAwesome5 style={styles.icon} name="key" size={24} color="black" />
                    <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} />

                </View>
            </View>

            <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity
                    onPress={() => router.push("/home")}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>

            </View>

            <Text style={styles.footer}>Copyright © 1Point 2024</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 20,
    },
    headerImage: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    input: {
        flex: 1,
    },
    loginText: {
        marginBottom: 10,
        marginTop: 20,
    },
    loginButton: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
        width: '100%',
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        alignItems: 'center',
        width: '100%',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        textAlign: 'center',
    },
});