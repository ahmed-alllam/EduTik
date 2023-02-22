import React from 'react'
import { View, Text, Image } from 'react-native'
import { useUser } from '../../../../hooks/useUser'
import { generalStyles } from '../../../../styles'
import styles from './styles'
import auth from '@react-native-firebase/auth'
const ChatSingleItem = ({ item }) => {
    const { data: userData, isLoading } = useUser(item.creator)

    if (isLoading) {
        return <></>
    }

    const isCurrentUser = item.creator === auth().currentUser.uid
    return (
        <View style={isCurrentUser ? styles.containerCurrent : styles.containerOther}>
            <Image style={generalStyles.avatarSmall} source={{ uri: userData.photoURL }} />
            <View style={isCurrentUser ? styles.containerTextCurrent : styles.containerTextOther}>
                <Text style={styles.text}>{item.message}</Text>
            </View>
        </View>
    )
}

export default ChatSingleItem
