import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView, Button } from 'react-native'
import { useSelector } from 'react-redux'
import styles from './styles'
import ProfileNavBar from '../../components/profile/navBar'
import ProfileHeader from '../../components/profile/header'
import ProfilePostList from '../../components/profile/postList'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CurrentUserProfileItemInViewContext } from '../../navigation/feed'
import { useUser } from '../../hooks/useUser'
import { getPostsByUserId } from '../../services/posts'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons';


export default function ProfileScreen({ navigation, route }) {
    const { initialUserId } = route.params
    const [userPosts, setUserPosts] = useState([])
    const currentUserObj = useSelector(state => state.auth);
    let userID = '';

    const goToAuth = () => {
        navigation.navigate('Auth')
    }

    let providerUserId = null
    if (CurrentUserProfileItemInViewContext != null) {
        providerUserId = useContext(CurrentUserProfileItemInViewContext)
    }

    if (initialUserId) {
        userID = initialUserId
    } else if (providerUserId) {
        userID = providerUserId
    } else if (currentUserObj && currentUserObj.currentUser) {
        userID = currentUserObj.currentUser.uid
    }

    const user = useUser(userID).data;
    useEffect(() => {
        if (user === undefined || user === null) {
            return;
        }
        getPostsByUserId(user.uid).then(setUserPosts)

    }, [user])

    return (
        <SafeAreaView style={styles.container}>
            {user ?
                (
                    <SafeAreaView>
                        <ProfileNavBar user={user} />
                        <ScrollView>
                            <View>
                                <ProfileHeader user={user} />
                                <ProfilePostList posts={userPosts} />
                            </View>
                        </ScrollView>
                    </SafeAreaView>)
                : (<SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={goToAuth} style={styles.createAccountButton} >
                        <Feather name="user-plus" size={24} color="white" />
                        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginLeft: 15}}>Create a free account</Text>
                    </TouchableOpacity>
                </SafeAreaView>
                )}
        </SafeAreaView>
    )
}
