import React from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight} from 'react-native';

class HomeScreen extends React.Component{
 
  render (){
    return (

      <View style={styles.container}>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Settings')}
        >
          <View style={[styles.buttonOptions, {backgroundColor: '#f40'}]}>
            <Text>Impostazioni</Text>
          </View> 
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Geolocation')}
        >
          <View style={[styles.buttonOptions, {backgroundColor: '#0df'}]}>
            <Text>Navigazione</Text>
          </View> 
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Report')}
        >
          <View style={[styles.buttonOptions, {backgroundColor: '#0f0'}]}>
            <Text>Statistiche</Text>
          </View> 
        </TouchableHighlight>
      </View>
    )
  }
}

HomeScreen.navigationOptions = ({navigation}) => ({
  headerTitle: 'Smart GPS Monitor',
});

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#054',
  },
  buttonOptions:{
    height: 70,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  }
});

export default HomeScreen;