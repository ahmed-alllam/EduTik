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


export default function ProfileScreen({ navigation, route }) {
    const { initialUserId } = route.params
    const [userPosts, setUserPosts] = useState([])

    const goToAuth = () => {
        navigation.navigate('Auth')
    }

    if (!initialUserId) {
        return (
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="Create an account to post videos" onPress={goToAuth} />
            </SafeAreaView>
        )
    }

    let providerUserId = null
    if (CurrentUserProfileItemInViewContext != null) {
        providerUserId = useContext(CurrentUserProfileItemInViewContext)
    }

    const user = useUser(initialUserId ? initialUserId : providerUserId).data;
    console.log("allam 2 ", initialUserId, providerUserId, useUser(initialUserId ? initialUserId : providerUserId))
    useEffect(() => {
        if (user === undefined) {
            return;
        }
        getPostsByUserId(user.uid).then(setUserPosts)

    }, [user])

    return (
        <SafeAreaView style={styles.container}>
            <ProfileNavBar user={user} />
            <ScrollView>
                {user ?
                    (
                        <View>
                            <ProfileHeader user={user} />
                            <ProfilePostList posts={userPosts} />
                        </View>
                    )
                    : null}
            </ScrollView>
        </SafeAreaView>
    )
}
