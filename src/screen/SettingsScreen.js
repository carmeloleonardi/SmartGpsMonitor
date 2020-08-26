
import React from 'react';
import {
    StyleSheet, 
    View, 
    Text, 
    Picker, 
    Button,
    TouchableHighlight,
    Dimensions,
    Alert
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

class SettingsScreen extends React.Component{

  state = {
    meters: '',
  }

  componentDidMount() {
    AsyncStorage.getItem('meters').then(
    (value) => this.setState({ 'meters': value }))
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.text}>Distanza in metri per l'aggiornamento della posizione</Text>
        <Picker
          itemStyle={{color: '#fff'}}
          selectedValue = {this.state.meters} 
          onValueChange = {this.setIntervalMeters}
        >
          <Picker.Item label = "1 metro" value = "1" />
          <Picker.Item label = "2 metri" value = "2" />
          <Picker.Item label = "5 metri" value = "5"/>
        </Picker>
        <TouchableHighlight
          style={styles.eraseButton}
          onPress={this.eraseAllData}
        >
          <Text style={styles.text}>Elimina dati di navigazione</Text>
        </TouchableHighlight>
        
      </View>
    )
  }

  setIntervalMeters = async (value) => {
    await AsyncStorage.setItem('meters', value);
    this.setState({ 'meters': value });
  }

  eraseAllData = () => {
    AsyncStorage.removeItem('listNavigation',() => 
      Alert.alert("Informazione","Lista di navigazione svuotata con successo","OK"));
  }
}
  
SettingsScreen.navigationOptions = ({navigation}) => ({
  headerTitle: 'Impostazioni',
  headerLeft: (
    <Button
      title="Indietro"
      color='#fff'
      onPress={() => navigation.goBack()}
    />
  )
})

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#054',
  },
  text:{
    fontSize: 20,
    fontFamily: 'Avenir'
  },
  eraseButton:{
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f20',
    width: Dimensions.get('window').width / 3,
  }
})

export default SettingsScreen;
