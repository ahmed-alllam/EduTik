import Constants from 'expo-constants';
import * as firebase from 'firebase';
import React from 'react';
import { Alert, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Route from './src/navigation/main';
import rootReducer from './src/redux/reducers';
import { useFonts } from 'expo-font';

import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

import { useEffect } from 'react';
import * as Linking from 'expo-linking';


function updateApp() {
  if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    Updates.reloadAsync();
  }
}


const store = createStore(rootReducer, applyMiddleware(thunk))

if (firebase.apps.length === 0) {
  firebase.initializeApp(Constants.manifest.web.config.firebase)
} else {
  firebase.app()
}

// init firebase analytics

import { LogBox } from 'react-native';


LogBox.ignoreAllLogs()

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchInterval: false, staleTime: Infinity } }
})

export default function App() {

  // listen to deep links even when app is closed
  useEffect(() => {
    Linking.addEventListener('url', (event) => {
      const { path, queryParams } = Linking.parse(event.url);
      console.log('path', path);
      console.log('queryParams', queryParams);

      Alert.alert(
        'Deep Link',
        `Linked to app with path: ${path} and data: ${JSON.stringify(
          queryParams
        )}`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    });
  }, []);

  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );

    Alert.alert(
      'Deep Link',
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  }

  updateApp();

  const [fontsLoaded] = useFonts({
    'Colton-Black': require('./assets/fonts/HDColton-Black.otf'),
    'Colton-Bold': require('./assets/fonts/HDColton-CondBlack.otf'),
    'Colton-Medium': require('./assets/fonts/HDColton-CompMedium.otf'),
    'Colton-Semi-Bold': require('./assets/fonts/HDColton-CompSemibold.otf'),
  });

  return (
    <Provider store={store} >
      <StatusBar backgroundColor={'transparent'} translucent />
      <QueryClientProvider client={queryClient}>
        <Route />
      </QueryClientProvider>
    </Provider>
  );
}
