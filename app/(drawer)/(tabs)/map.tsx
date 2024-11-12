import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';



interface SinglePlace {
  latitude: number;
  longitude: number;
}

interface AllPlaces {
  fsq_id: string;
  name: string;
}


export default function App() {
  const [location, setLocation] = useState<null | any>(null); 
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [search, setSearch] = useState(''); 
  const [places, setPlaces] = useState<null | AllPlaces[]>(null);
  const [singlesearchPlace, setsinglesearchPlace] = useState<null | SinglePlace>(null); 
  const [region, setRegion] = useState<any>(null); 
  const [direction, setDirection] = useState<boolean>(false);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);


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
      .then(res => {
        setPlaces(res.results);
      })
      .catch(err => console.error(err));
  };

  
  const singlePlace = (item: any) => {
    if (
      !singlesearchPlace ||
      singlesearchPlace.latitude !== item.geocodes.main.latitude ||
      singlesearchPlace.longitude !== item.geocodes.main.longitude
    ) {
      setsinglesearchPlace({
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
    <SafeAreaView style={styles.container}>
      {location && region && (
        <MapView region={region} style={styles.map} showsUserLocation={true}>
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
          {singlesearchPlace && (
            <Marker
              coordinate={{
                latitude: singlesearchPlace.latitude,
                longitude: singlesearchPlace.longitude,
              }}
            />
          )}
          {singlesearchPlace && direction && (
            <Polyline
              coordinates={[
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
                {
                  latitude: singlesearchPlace.latitude,
                  longitude: singlesearchPlace.longitude,
                },
              ]}
              strokeWidth={5}
              strokeColor="#000000"
            />
          )}
        </MapView>
      )}
      
      <View style={styles.searchContainer}>


      <TextInput
        style={styles.input}
        onChangeText={setSearch}
        value={search}
        placeholder="Where To ?"
        />
      <TouchableOpacity onPress={searchPlaces} style={styles.button}>
        <Text>Search</Text>
      </TouchableOpacity>
      </View>


      <View style={styles.searchPlaces}>

      {places && (
        <FlatList
        data={places}
        renderItem={({ item }: { item: { name: string } }) => {
          return (
            <View style={styles.list}>
                <Text onPress={() => singlePlace(item)}>{item.name}</Text>
              </View>
            );
          }}
          keyExtractor={(item: { fsq_id: string }) => item.fsq_id}
          />
        )}
        </View>

{places &&
      <View style={styles.directionbuttons}>

        <TouchableOpacity onPress={() => setDirection(!direction)} style={styles.dirextionbtn}>
        <Text>Direction</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() =>{ setPlaces([])
        setDirection(false)
        setSearch('')
        setsinglesearchPlace(null)
        
      } } style={styles.canclebtn}>
        <Text>cancle</Text>
      </TouchableOpacity>
        </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  map: {
    marginTop: -30,
    width: '120%',
    height: '50%',
    position: 'relative',
    // borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  searchContainer:{
    flex:1,
    height:10,
    backgroundColor: '#f',
    flexDirection:'row',
    justifyContent:'space-between',
    // maxHeigh,
    gap:10,
    paddingHorizontal:10,
    
  }
  ,
  input: {
    flex:2,
    flexDirection:'row',
    height:50,
    
    marginVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginVertical: 12,
    height:50,
    fontSize:10,
  },
  searchPlaces:{
    flex:1,
    flexDirection:'row',
    
  },
  list: {
    
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    width: '100%',
  },
  directionbuttons:{
    flexDirection:'row',
    justifyContent:'space-between',
    gap:40,
  },
  canclebtn:{
    backgroundColor:'#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius:10,


  },
  dirextionbtn:{
    backgroundColor:'#4CAF50',
    paddingVertical: 12,
    paddingHorizontal:10,
    borderRadius:10,
  }

});