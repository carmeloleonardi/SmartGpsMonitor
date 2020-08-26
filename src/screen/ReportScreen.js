import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';


class ReportScreen extends React.Component{
    
    state = {
        listNavigation : []
    }

    componentDidMount(){

        AsyncStorage.getItem('listNavigation').then( response => 
            this.setState({listNavigation: JSON.parse(response) || [] })
        );
    }


    render(){
        return(
            <View style={styles.container}>
                <FlatList 
                    data={this.state.listNavigation}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        )
    }

    _renderItem = ({item}) => (
        <View style={[styles.rowItem, ]}>
            <Text style={styles.textHeader}>Etichetta: {item.label}</Text>
            {
                item.coords.map((arr,i) => (
                    <Text
                        style={styles.textContent}
                        key={i}
                    >
                        Timestamp: {arr.timestamp} Stato del device:{arr.stateDevice} {'\n'}
                        Latitudine: {arr.latitude} {'\0'}  
                        Longitudine: {arr.longitude} {'\0'}
                        Altitudine: {arr.altitude} {'\0'}
                        KM percorsi {arr.odometer} {'\0'}
                    </Text>
                ))
            }
        </View>
    )
    
    _keyExtractor = (item, index) => index.toString();

}

ReportScreen.navigationOptions = ({navigation}) => ({
    headerTitle: 'Statistiche di navigazione'
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#054',
    },
    rowItem: {
        alignItems: 'flex-start',
        backgroundColor: '#ff8',
        borderRadius: 5,
        margin: 5,
    },
    textHeader:{
        fontFamily: 'Avenir',
        padding: 5,
        fontSize: 20
    },
    textContent: {
        fontFamily: 'Avenir-light',
        paddingLeft: 10
    }
})

export default ReportScreen;
