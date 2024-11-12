import { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

interface Geocodes {
  main: {
    latitude: number;
    longitude: number;
  };
}

interface PlaceItem {
  fsq_id: string;
  name: string;
  geocodes: Geocodes;
}

interface SinglePlace {
  latitude: number;
  longitude: number;
}


interface AllPlaces {
  fsq_id: string;
  name: string;
}

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<AllPlaces[] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SinglePlace | null>(null);
  const [region, setRegion] = useState<any>(null);
  const [showDirection, setShowDirection] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation);
    setRegion({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const searchPlaces = () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3qbL9ORBTq2ZaS6TUHxpAQZNDJjTlkT2lBeAynwmhZ8I=',
      },
    };

    fetch(`https://api.foursquare.com/v3/places/search?query=${search}&ll=${location.coords.latitude}%2C${location.coords.longitude}&radius=100000`, options)
      .then(res => res.json())
      .then(data => setPlaces(data.results))
      .catch(err => console.error(err));
  };

  const handlePlaceSelection = (item: PlaceItem) => {
    if (!selectedPlace || 
        selectedPlace.latitude !== item.geocodes.main.latitude || 
        selectedPlace.longitude !== item.geocodes.main.longitude) {
      setSelectedPlace({
        latitude: item.geocodes.main.latitude,
        longitude: item.geocodes.main.longitude,
      });
      setRegion({
        latitude: item.geocodes.main.latitude,
        longitude: item.geocodes.main.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start p-5 bg-gray-100">
      {location && (
        <MapView 
          region={region} 
          onRegionChangeComplete={setRegion}  
          style={{ width: '100%', height: '50%', marginTop: 10 }}
        >
          <Marker coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }} />
          {selectedPlace && <Marker coordinate={selectedPlace} />}
          {selectedPlace && showDirection && (
            <Polyline 
              coordinates={[
                { latitude: location.coords.latitude, longitude: location.coords.longitude }, 
                selectedPlace
              ]} 
              strokeWidth={5} 
              strokeColor='#000000' 
            />
          )}
        </MapView>
      )}
      
      {/* Transport Options */}
      <View className="flex-row justify-between w-full mt-2 mb-2">
        <TouchableOpacity className="bg-green-600 w-[100px] h-[70px] rounded-lg items-center justify-center">
          <Image source={require('../../assets/caricon.jpg')} className="w-8 h-8" tintColor="white" />
          <Text className="text-white mt-1">Car</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-200 w-[100px] h-[70px] rounded-lg items-center justify-center">
          <Image source={require('../../assets/bikeicon.png')} className="w-8 h-8" />
          <Text className="text-gray-600 mt-1">Bike</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-200 w-[100px] h-[70px] rounded-lg items-center justify-center">
          <Image source={require('../../assets/rikshawicon.jpeg')} className="w-8 h-8" />
          <Text className="text-gray-600 mt-1">Rickshaw</Text>
        </TouchableOpacity>
      </View>

      {/* Location Text */}
      <Text className="text-gray-500 self-start ml-1 mb-2">Your Location: 123 Main Street</Text>

      {/* Search Container */}
      <View className="w-full flex-row items-center bg-white rounded-lg px-4 h-12 border border-gray-200">
        <Image source={require('../../assets/searchicon.png')} className="w-5 h-5 mr-2" tintColor="gray" />
        <TextInput
          className="flex-1 text-base text-gray-800"
          onChangeText={setSearch}
          value={search}
          placeholder="Search the place"
          placeholderTextColor="#666"
        />
      </View>


      <TouchableOpacity 
        onPress={searchPlaces} 
        className="items-center justify-center bg-red-500 py-3 px-6 rounded-lg my-2.5"
      >
        <Text className="text-white">Search</Text>
      </TouchableOpacity>

      {places && (
        <FlatList
          data={places}
          renderItem={({ item }: { item: PlaceItem }) => (
            <View className="bg-white rounded-lg p-4 my-1.5 w-full">
              <Text onPress={() => handlePlaceSelection(item)}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item: PlaceItem) => item.fsq_id}
        />
      )}

      <TouchableOpacity 
        onPress={() => setShowDirection(!showDirection)} 
        className="items-center justify-center bg-red-500 py-3 px-6 rounded-lg my-2.5"
      >
        <Text className="text-white">Direction</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => { 
          setPlaces(null);
          setShowDirection(false);
          setSearch('');
          setSelectedPlace(null);
        }}
        className="mt-2"
      >
        <Text className="text-red-500">Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


// import { useState, useEffect } from 'react';
// import { Platform, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import * as Location from 'expo-location';

// interface Geocodes {
//   main: {
//     latitude: number;
//     longitude: number;
//   };
// }

// interface PlaceItem {
//   fsq_id: string;
//   name: string;
//   geocodes: Geocodes;
// }

// interface SinglePlace {
//   latitude: number;
//   longitude: number;
// }

// interface AllPlaces {
//   fsq_id: string;
//   name: string;
// }

// export default function App() {
//   const [location, setLocation] = useState<any>(null); // User's current location
//   const [errorMsg, setErrorMsg] = useState<string | null>(null); // For error message if permission is denied
//   const [search, setSearch] = useState(''); // Stores the search query
//   const [places, setPlaces] = useState<AllPlaces[] | null>(null); // Stores the list of places from search results
//   const [selectedPlace, setSelectedPlace] = useState<SinglePlace | null>(null); // Stores the selected place's coordinates
//   const [region, setRegion] = useState<any>(null); // Stores the map's region
//   const [showDirection, setShowDirection] = useState(false); // Show direction line

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   const requestLocationPermission = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setErrorMsg('Permission to access location was denied');
//       return;
//     }

//     let userLocation = await Location.getCurrentPositionAsync({});
//     setLocation(userLocation);
//     setRegion({
//       latitude: userLocation.coords.latitude,
//       longitude: userLocation.coords.longitude,
//       latitudeDelta: 0.05,
//       longitudeDelta: 0.05,
//     });
//   };

//   const searchPlaces = () => {
//     const options = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         Authorization: 'fsq3qbL9ORBTq2ZaS6TUHxpAQZNDJjTlkT2lBeAynwmhZ8I=',
//       },
//     };

//     fetch(`https://api.foursquare.com/v3/places/search?query=${search}&ll=${location.coords.latitude}%2C${location.coords.longitude}&radius=100000`, options)
//       .then(res => res.json())
//       .then(data => setPlaces(data.results))
//       .catch(err => console.error(err));
//   };

//   const handlePlaceSelection = (item: PlaceItem) => {
//     if (!selectedPlace || 
//         selectedPlace.latitude !== item.geocodes.main.latitude || 
//         selectedPlace.longitude !== item.geocodes.main.longitude) {
//       setSelectedPlace({
//         latitude: item.geocodes.main.latitude,
//         longitude: item.geocodes.main.longitude,
//       });
//       setRegion({
//         latitude: item.geocodes.main.latitude,
//         longitude: item.geocodes.main.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       });
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, padding: 10 }}>
//       {location && (
//         <MapView 
//           region={region} 
//           onRegionChangeComplete={setRegion}  
//           style={{ width: '100%', height: '50%', marginTop: 10 }}
//         >
//           <Marker coordinate={{
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           }} />
//           {selectedPlace && <Marker coordinate={selectedPlace} />}
//           {selectedPlace && showDirection && (
//             <Polyline 
//               coordinates={[
//                 { latitude: location.coords.latitude, longitude: location.coords.longitude }, 
//                 selectedPlace
//               ]} 
//               strokeWidth={5} 
//               strokeColor='#000000' 
//             />
//           )}
//         </MapView>
//       )}
      
//       <Text>Location Search</Text>

//       {/* Search Input */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, height: 40, borderColor: '#ccc', borderWidth: 1 }}>
//         <TextInput
//           style={{ flex: 1 }}
//           onChangeText={setSearch}
//           value={search}
//           placeholder="Search for places"
//           placeholderTextColor="#666"
//         />
//       </View>

//       <TouchableOpacity 
//         onPress={searchPlaces} 
//         style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', paddingVertical: 10, borderRadius: 10, marginVertical: 10 }}
//       >
//         <Text style={{ color: 'white' }}>Search</Text>
//       </TouchableOpacity>

//       {/* Places List */}
//       {places && (
//         <FlatList
//           data={places}
//           renderItem={({ item }: { item: PlaceItem }) => (
//             <TouchableOpacity 
//               onPress={() => handlePlaceSelection(item)}
//               style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, marginVertical: 5 }}
//             >
//               <Text>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item: PlaceItem) => item.fsq_id}
//         />
//       )}

//       {/* Direction Toggle Button */}
//       <TouchableOpacity 
//         onPress={() => setShowDirection(!showDirection)} 
//         style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', paddingVertical: 10, borderRadius: 10, marginVertical: 10 }}
//       >
//         <Text style={{ color: 'white' }}>Toggle Directions</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }
