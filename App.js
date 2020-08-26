import {createAppContainer, createStackNavigator} from 'react-navigation';

import HomeScreen from './src/screen/HomeScreen';
import GeolocationScreen from './src/screen/GeolocationScreen';
import ReportScreen from './src/screen/ReportScreen'
import SettingsScreen from './src/screen/SettingsScreen'

const App = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Settings: {
      screen: SettingsScreen
    },
    Geolocation: {
      screen: GeolocationScreen
    },
    Report: {
      screen: ReportScreen
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#aaa',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default createAppContainer(App);
