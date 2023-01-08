import Constants from 'expo-constants';
import * as firebase from 'firebase';
import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Route from './src/navigation/main';
import rootReducer from './src/redux/reducers';
import { useFonts } from 'expo-font';


const store = createStore(rootReducer, applyMiddleware(thunk))

if (firebase.apps.length === 0) {
  firebase.initializeApp(Constants.manifest.web.config.firebase)
} else {
  firebase.app()
}

// init firebase analytics

import { LogBox } from 'react-native';


LogBox.ignoreLogs(['Setting a timer for a long period of time'])

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchInterval: false, staleTime: Infinity } }
})

export default function App() {


  const [fontsLoaded] = useFonts({
    'Colton-Black': require('./assets/fonts/HDColton-Black.otf'),
    'Colton-Bold': require('./assets/fonts/HDColton-CondBlack.otf'),
    'Colton-Medium': require('./assets/fonts/HDColton-CompMedium.otf'),
    'Colton-Semi-Bold': require('./assets/fonts/HDColton-CompSemibold.otf'),
  });

  return (
    <Provider store={store} >
      {/* <StatusBar hidden={true} /> */}

      <QueryClientProvider client={queryClient}>
        <Route />
      </QueryClientProvider>
    </Provider>
  );
}
