import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Button,
  FlatList,
  TouchableHighlight,
  TextInput,
  Alert,
  
} from 'react-native';

import MapView from 'react-native-maps';
import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage'

const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

const stateDevice = {
  BLOCK_ON: 'BLOCK-ON', // aereo fermo
  BLOCK_OFF: 'BLOCK-OFF', //aereo in partenza
  TAKE_OFF: 'TAKE-OFF', // aereo in volo
  LANDING: 'LANDING'  // aereo in atterraggio
}

class GeolocationScreen extends React.Component{

  state = {
    enabled: false,
    isMoving: false,
    motionActivity: {activity: 'unknown', confidence: 100},
    activity: stateDevice.BLOCK_ON,
    odometer: '0.0',
    // MapView
    markers: [],
    coordinates: [],
    showsUserLocation: false,
    coords: [],
    labelLocation: '',
    listNavigation: [],
    meters:''
  }

  componentDidMount(){

    AsyncStorage.getItem('listNavigation').then(response =>
      this.setState({ listNavigation: JSON.parse(response) || [] })
    );

    AsyncStorage.getItem('meters')
    .then(
      (value) => this.setState({ meters: value })
    )

    BackgroundGeolocation.stop();

    BackgroundGeolocation.on('location', this.onLocation.bind(this));
    BackgroundGeolocation.on('motionchange', this.onMotionChange.bind(this));
    BackgroundGeolocation.on('activitychange', this.onActivityChange.bind(this));

    BackgroundGeolocation.ready({
      reset: true,
      stopTimeout: 0.3,
      distanceFilter: this.state.meters,  //distanza in metri per l'aggiornamento della posizione
      autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true,
      foregroundService: true,
      debug: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    }, (state) => {
      this.setState({
        enabled: state.enabled,
        isMoving: state.isMoving,
        showsUserLocation: state.enabled,
      });      
    });
  
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();

  }

  render(){
    return(
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          showsUserLocation={this.state.showsUserLocation}
          followsUserLocation={false}
          scrollEnabled={true}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsScale={false}
          showsTraffic={false}
          toolbarEnabled={false}>
          <MapView.Polyline
            key="polyline"
            coordinates={this.state.coordinates}
            geodesic={true}
            strokeColor='rgba(0,179,253, 0.6)'
            strokeWidth={6}
            zIndex={0}
          />        
          {this.state.markers.map((marker) => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              anchor={{x:0, y:0.1}}
              title={marker.title}>
              <View style={[styles.markerIcon]}></View>
            </MapView.Marker>))
          }
        </MapView>

        <View style={styles.monitor}>
          <View style={styles.rowState}>
            <TouchableHighlight
              style={[styles.buttonPower, !this.state.enabled ? {backgroundColor: '#0f0'} : {backgroundColor: '#f00'}]}
              onPress={this.toogleNavigation.bind(this)}
            >
              {
                !this.state.enabled ? 
                (<Text>Avvia navigazione</Text>) : (<Text>Ferma navigazione</Text>)
              }
            </TouchableHighlight>
            <TextInput 
              style={styles.textInput}
              value={this.state.labelLocation}
              placeholder="Etichetta per la geolocalizzazione"
              
              onChangeText={value => this.setState({ labelLocation: value })}
              editable={!this.state.enabled}
            />
            <View>
              <Text>Stato del dispositivo: {this.state.activity} </Text>
            </View>
          </View>
          <View style={styles.console}>
            <FlatList 
              data={this.state.coords}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
        </View>
      </View>
    )
  }
//flatlist metodi
  _renderItem = ({item}) => (
    <View>
      <Text style={styles.coordsDetected}>
        Timestamp: {item.timestamp} {'\n'}
        Latitudine: {item.latitude} Longitudine: {item.longitude} Altitudine: {item.altitude}  KM percorsi: {item.odometer}
      </Text>
    </View>
  )

  _keyExtractor = (item, index) => index.toString();

  renderSeparator = () => {
    return (
      <View
        style={{
          margin: 3,
          //height: 1,
         // width: "86%",
          //backgroundColor: "#CED0CE",
          //marginLeft: "14%"
        }}
      />
    );
  };
//map metodi
  addMarker(location) {
    let marker = {
      key: location.uuid,
      title: location.timestamp,
      heading: location.coords.heading,
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    };

    this.setState({
      markers: [...this.state.markers, marker],
      coordinates: [...this.state.coordinates, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }]
    });
  }

  setCenter(location) {
    if (!this.refs.map) { return; }

    this.refs.map.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  }

  renderMarkers() {
    let rs = [];
    this.state.markers.map((marker) => {
      rs.push((
        <MapView.Marker
          key={marker.key}
          coordinate={marker.coordinate}
          anchor={{x:0, y:0.1}}
          title={marker.title}>
          <View style={[styles.markerIcon]}></View>
        </MapView.Marker>
      ));
    });
    return rs;
  }

  toogleNavigation(){

    if(this.state.labelLocation === ''){
      Alert.alert("Attenzione!","Digitare un etichetta per la geolocalizzazione!","OK");
      return;
    }else{
      let label = this.state.labelLocation;

      for(let i = 0; i < this.state.listNavigation.length; i++){
        if(label === this.state.listNavigation[i].label){
          Alert.alert("Attenzione!","Etichetta gia esistente!","OK");
          return;
        }
      }

    }

    let enabled = !this.state.enabled;

    this.setState({
      enabled: enabled,
      showsUserLocation: false,
      coordinates: [],
      markers: []
    });

    if (enabled) {
      BackgroundGeolocation.start((state) => {
        this.setState({
          showsUserLocation: true,
          activity: stateDevice.BLOCK_OFF,
        });
      });
    } else {
      this.setState({
        activity: stateDevice.BLOCK_ON,
      });     
      BackgroundGeolocation.stop();
      
      let navLocation = {
        label: this.state.labelLocation,
        coords: this.state.coords
      }
      let newListNavigation = [...this.state.listNavigation,navLocation]
      this.storeData(newListNavigation);
    }

    let isMoving = !this.state.isMoving;

    this.setState({isMoving: isMoving});
    BackgroundGeolocation.changePace(isMoving);
    
  }

  storeData = listNavigation => {
  
   AsyncStorage.setItem('listNavigation', JSON.stringify(listNavigation)).then(
     () => (
       setTimeout(
         () => Alert.alert("Salvataggio","Dati di navigazione salvati con successo","OK"))),1000);

    this.setState({
      listNavigation,
      labelLocation: '',
      coords: []
    });

  }

  /**
   * @event location
   */
  onLocation(location) {
    console.log('[event] location: ', location);

    if (!location.sample) {


      this.addMarker(location);

      let coords = {
        stateDevice: this.state.activity,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        timestamp: location.timestamp,
        odometer: (location.odometer/1000).toFixed(1),
      }

      this.setState({
        coords: [...this.state.coords,coords]
      });
    }
  
    this.setCenter(location);
  }

  /**
  * @event motionchange
  */
  onMotionChange(event) {

    let isMoving = event.isMoving;

    if(!isMoving){
      this.setState({activity: stateDevice.BLOCK_ON});
      setTimeout(
        () => {

          this.toogleNavigation();
        },1000
      )
      
      
    }else{
      setTimeout(
        () => this.setState({
          activity: stateDevice.TAKE_OFF
        }),3000
      )
      
    }

  }
  /**
  * @event activitychange
  */
  onActivityChange(event) {
    this.setState({
      motionActivity: event
    });
    
    if(event.activity === 'still'){
      this.setState({activity:stateDevice.LANDING})
    }
    
  }
}

GeolocationScreen.navigationOptions = ({navigation}) => ({
  headerTitle: 'Navigazione',
  headerRight: (
    <Button 
      title="Statistiche"
      color='#fff'
      onPress={() => navigation.navigate('Report')}
    />
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  map: {
    height: Dimensions.get('window').height/2
  },
  monitor: {
    flex:1,
    backgroundColor: '#054',
  },
  rowState: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ee0',
    paddingLeft: 10,
    marginTop: 5,
    paddingRight: 10
  },
  console: {
    margin: 10,
    flex: 1,
    backgroundColor: '#000'
  },
  buttonPower:{
    height: 40,
    width: 150,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordsDetected: {
    color: '#0f0'
  },
  textInput:{
    backgroundColor: '#fff',
    height: 40,
    width: 250,
    borderWidth: 0.5,
    padding: 10
  }
})

export default GeolocationScreen;