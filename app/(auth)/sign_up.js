import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../utils/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');





const Signup = () => {


  
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('map')
      // ...
    }
  });



  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    if (fullname === "" || email === "" || password === "") {
      Alert.alert("Warning", "Please fill in all fields.");
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", response.user.uid), {
        fullname: fullname,
        email: email,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully.");
      setFullname("");
      setEmail("");
      setPassword("");
      router.push('map');  // Ensure the 'map' route exists
    } catch (error) {
      Alert.alert("Failed to sign up", error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#fe0002', '#ff3b30']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Image
              source={require('../../assets/yangologo.png')}
              style={styles.logo}
            />

            <View style={styles.formContainer}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#fe0002"
                style={styles.input}
                value={fullname}
                onChangeText={setFullname}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#fe0002"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#fe0002"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Updated navigation for login */}
            <TouchableOpacity onPress={() => router.push('sign_in')}>
              <Text style={styles.linkText}>Already have an account? Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: height * 0.9,
  },
  logo: {
    width: width * 2.30,
    height: height * 0.2,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  formContainer: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#fe0002',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fe0002',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Signup;
