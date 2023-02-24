import React, { useEffect } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { userAuthStateListener } from '../../redux/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../../screens/auth'
import HomeScreen from '../home';
import SavePostScreen from '../../screens/savePost';
import EditProfileScreen from '../../screens/profile/edit';
import EditProfileFieldScreen from '../../screens/profile/edit/field';
import Modal from '../../components/modal';
import ProfileScreen from '../../screens/profile';
import FeedScreen from '../../screens/feed';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import firebase dynamic links
import dynamicLinks from '@react-native-firebase/dynamic-links';

const Stack = createStackNavigator()


export default function Route() {
    const currentUserObj = useSelector(state => state.auth)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userAuthStateListener());
    }, [])

    const navigationRef = React.createRef();

    if (!currentUserObj.loaded) {
        return (
            <View></View>
        )
    }

    console.log('loaded')



    const linking = {
        prefixes: ['https://edutik.site', 'edutik://', 'myapp://'],

        async getInitialURL() {
            const link = await dynamicLinks().getInitialLink();

            console.log('allam link', link);
            return link?.url;
        },

        subscribe(listener) {
            const unsubscribeFirebase = dynamicLinks().onLink(({ url }) => {
                console.log('allam url', url);
                listener(url);
            });

            return () => {
                unsubscribeFirebase();
            };
        },

        config: {
            screens: {
                // go to userPosts screen with initCreation param
                userPosts: {
                    path: ':postID',
                }
            },
        },
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <NavigationContainer ref={navigationRef} linking={linking}>
                <Stack.Navigator>
                    {currentUserObj.currentUser == null ?
                        <>
                            <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="userPosts" component={FeedScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="profileOther" component={ProfileScreen} options={{ headerShown: false }} />
                        </>
                        :
                        <>
                            <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="savePost" component={SavePostScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="userPosts" component={FeedScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="profileOther" component={ProfileScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="editProfile" component={EditProfileScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="editProfileField" component={EditProfileFieldScreen} options={{ headerShown: false }} />
                        </>
                    }
                </Stack.Navigator>
                <Modal navigationRef={navigationRef} />
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}
