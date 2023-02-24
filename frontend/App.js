import Constants from 'expo-constants';
import firebase from '@react-native-firebase/app';
import React from 'react';
import { Alert, StatusBar, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Route from './src/navigation/main';
import rootReducer from './src/redux/reducers';
import { useFonts } from 'expo-font';

import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import {
  getFcmToken,
  requestUserPermission,
  notificationListener,
} from './PushController';
import { useEffect, useState } from 'react';


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
  const [generatedToken, setGeneratedToken] = useState();

  useEffect(() => {
    console.log('newly generated', generatedToken);
  }, [generatedToken]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFcmToken();
      if (token) {
        setGeneratedToken(token);
      }
    };
    void fetchToken();
    void requestUserPermission();
    void notificationListener();
  }, []);

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
