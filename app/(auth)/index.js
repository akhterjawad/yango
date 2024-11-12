import React, { useEffect } from 'react';
import ride_app_logo from '../../assets/yangologo.png';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const scaleUserButton = new Animated.Value(0.8);
  const scaleDriverButton = new Animated.Value(0.8);
  const logoOpacity = new Animated.Value(0);
  const logoTranslateY = new Animated.Value(-20);
  const titleTranslateY = new Animated.Value(20);
  const titleOpacity = new Animated.Value(0);
  const subtitleTranslateY = new Animated.Value(20);
  const subtitleOpacity = new Animated.Value(0);

  const router = useRouter();

  useEffect(() => {

    Animated.sequence([

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.spring(scaleUserButton, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleDriverButton, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const onPressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Animated Logo */}
        <Animated.Image
          style={[
            styles.logo,
            { opacity: logoOpacity, transform: [{ translateY: logoTranslateY }] },
          ]}
          source={ride_app_logo}
        />


        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          Welcome to Yango
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          Your Ride, Anytime, Anywhere
        </Animated.Text>


        <Animated.View style={{ transform: [{ scale: scaleUserButton }] }}>
          <TouchableOpacity
            style={styles.userButton}
            onPressIn={() => onPressIn(scaleUserButton)}
            onPressOut={() => onPressOut(scaleUserButton)}
            onPress={() => router.push('sign_up')}
          >
            <Text style={styles.buttonText}>User</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleDriverButton }] }}>
          <TouchableOpacity
            style={styles.driverButton}
            onPressIn={() => onPressIn(scaleDriverButton)}
            onPressOut={() => onPressOut(scaleDriverButton)}
            onPress={() => router.push('driverregister')}
          >
            <Text style={styles.buttonText}>Driver</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0000',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 180,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    color: '#dcdcdc',
    textAlign: 'center',
    marginBottom: 50,
  },
  userButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  driverButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default WelcomeScreen;
