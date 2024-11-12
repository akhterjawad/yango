import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DriverHome = () => {
    const [driverDetails, setDriverDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const drivingInfo = {
        ongoingTrip: "Trip to Downtown",
        totalDistance: "150 km",
        rating: "4.8",
        tripsCompleted: "120",
    };

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const details = await AsyncStorage.getItem('driverDetails');
                if (details) {
                    const parsedDetails = JSON.parse(details);
                    if (!parsedDetails.email.includes('@')) {
                        Alert.alert('Error', 'Invalid email format: Email should contain "@"');
                    } else {
                        setDriverDetails(parsedDetails);
                    }
                }
            } catch (error) {
                console.error('Failed to load driver details:', error);
            }
        };
        fetchDriverDetails();
    }, []);

    const handleProfileClick = () => {
        setModalVisible(true);
    };

    if (!driverDetails) {
        return <Text style={styles.loadingText}>Loading driver details...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.infoCardsContainer}>
                <View style={[styles.infoCard, styles.cardShadow]}>
                    <Text style={styles.cardTitle}>Ongoing Trip</Text>
                    <Text style={styles.cardText}>{drivingInfo.ongoingTrip}</Text>
                </View>
                <View style={[styles.infoCard, styles.cardShadow]}>
                    <Text style={styles.cardTitle}>Total Distance</Text>
                    <Text style={styles.cardText}>{drivingInfo.totalDistance}</Text>
                </View>
            </View>

            <View style={styles.infoCardsContainer}>
                <View style={[styles.infoCard, styles.cardShadow]}>
                    <Text style={styles.cardTitle}>Rating</Text>
                    <Text style={styles.cardText}>{drivingInfo.rating}</Text>
                </View>
                <View style={[styles.infoCard, styles.cardShadow]}>
                    <Text style={styles.cardTitle}>Trips Completed</Text>
                    <Text style={styles.cardText}>{drivingInfo.tripsCompleted}</Text>
                </View>
            </View>

            {driverDetails.driverImage && (
                <TouchableOpacity onPress={handleProfileClick} style={styles.profileImageWrapper}>
                    <Image source={{ uri: driverDetails.driverImage }} style={styles.driverImage} />
                </TouchableOpacity>
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Driver Profile</Text>
                        {driverDetails.driverImage && (
                            <Image source={{ uri: driverDetails.driverImage }} style={styles.modalDriverImage} />
                        )}
                        <Text style={styles.modalInfo}>Name: {driverDetails.name}</Text>
                        <Text style={styles.modalInfo}>License Number: {driverDetails.licenseNumber}</Text>
                        <Text style={styles.modalInfo}>Vehicle Type: {driverDetails.vehicleType}</Text>
                        <Text style={styles.modalInfo}>Email: {driverDetails.email}</Text>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f2ff',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
    },
    infoCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginVertical: 20,
    },
    infoCard: {
        width: '45%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4d94ff',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
    profileImageWrapper: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    driverImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#4d94ff',
        resizeMode: 'cover',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4d94ff',
        marginBottom: 10,
    },
    modalDriverImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: '#4d94ff',
    },
    modalInfo: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
});

export default DriverHome;
