import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Avatar } from 'react-native-paper'
import { buttonStyles } from '../../../styles'
import styles from './styles'
import firebase from 'firebase'
import { Feather } from '@expo/vector-icons'
import { useFollowing } from '../../../hooks/useFollowing'
import { useFollowingMutation } from '../../../hooks/useFollowingMutation'

/**
 * Renders the header of the user profile and
 * handles all of the actions within it like follow, unfollow and
 * routing to the user settings.
 * 
 * @param {Object} props 
 * @param {Object} props.user information of the user to display 
 * @returns 
 */
export default function ProfileHeader({ user }) {
    const navigation = useNavigation()
    const [videosCount, setVideosCount] = useState(0)
    // const isFollowing = useFollowing(firebase.auth().currentUser.uid, user.uid).data
    // const isFollowingMutation = useFollowingMutation()
    // const renderFollowButton = () => {
    //     if (isFollowing) {
    //         return (
    //             <View style={{ flexDirection: 'row' }}>
    //                 <TouchableOpacity
    //                     style={buttonStyles.grayOutlinedButton}
    //                     onPress={() => navigation.navigate('chatSingle', { contactId: user.uid })}
    //                 >
    //                     <Text style={buttonStyles.grayOutlinedButtonText}>Message</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity
    //                     style={buttonStyles.grayOutlinedIconButton}
    //                     onPress={() => isFollowingMutation.mutate({ otherUserId: user.uid, isFollowing })}

    //                 >
    //                     <Feather name="user-check" size={20} />
    //                 </TouchableOpacity>
    //             </View>
    //         )
    //     } else {
    //         return (
    //             <TouchableOpacity
    //                 style={buttonStyles.filledButton}
    //                 onPress={() => isFollowingMutation.mutate({ otherUserId: user.uid, isFollowing })}
    //             >
    //                 <Text style={buttonStyles.filledButtonText}>Follow</Text>
    //             </TouchableOpacity>
    //         )

    //     }
    // }

    console.log('user', user)

    firebase.firestore().collection('post').where('creator', '==', user.uid).where('verified', '==', true).get()
        .then((querySnapshot) => {
            setVideosCount(querySnapshot.size)
        })

    return (
        <View style={styles.container}>
            <Image source={{ uri: user.photoURL }} style={{ height: 100, width: 100, borderRadius: 50 }} />
            <Text style={styles.emailText}>{user.email}</Text>
            
            <View style={styles.counterContainer}>
                <View style={styles.counterItemContainer}>
                    <Text style={styles.counterNumberText}>{videosCount}</Text>
                    <Text style={styles.counterLabelText}>Videos</Text>
                </View>
                <View style={styles.counterItemContainer}>
                    <Text style={styles.counterNumberText}>{user.score}</Text>
                    <Text style={styles.counterLabelText}>Points</Text>
                </View>
            </View>

            {firebase.auth().currentUser && firebase.auth().currentUser.uid === user.uid ?
                <TouchableOpacity
                    style={buttonStyles.grayOutlinedButton}
                    onPress={() => navigation.navigate('editProfile')}
                >
                    <Text style={buttonStyles.grayOutlinedButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                :
                // renderFollowButton()
                null
            }
        </View>
    )
}
