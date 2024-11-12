import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const DriverRegistrationScreen = () => {
    const [driverImage, setDriverImage] = useState(null);
    const [name, setName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setDriverImage(`data:image/jpeg;base64,${base64Image}`);
        }
    };

    const handleSubmit = async () => {
        if (name && licenseNumber && vehicleType && email) {
            const driverData = {
                driverImage,
                name,
                licenseNumber,
                vehicleType,
                email,
            };

            try {
                await AsyncStorage.setItem('driverDetails', JSON.stringify(driverData));
                Alert.alert('Registration Successful', 'Driver details have been submitted.');
                router.push('driverhome'); // Navigate to DriverDashboard
            } catch (error) {
                Alert.alert('Error', 'Failed to save driver details.');
            }
        } else {
            Alert.alert('Error', 'Please fill out all fields.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Driver Registration</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
                {driverImage ? (
                    <Image source={{ uri: driverImage }} style={styles.driverImage} />
                ) : (
                    <Text style={styles.imagePickerText}>Upload Driver Image</Text>
                )}
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="License Number" value={licenseNumber} onChangeText={setLicenseNumber} />
            <TextInput style={styles.input} placeholder="Vehicle Type (e.g., Car, Bike)" value={vehicleType} onChangeText={setVehicleType} />
            <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    imagePicker: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#d3d3d3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    driverImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePickerText: {
        color: '#777',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#d32f2f',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default DriverRegistrationScreen;
