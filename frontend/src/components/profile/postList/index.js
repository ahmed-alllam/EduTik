import React from 'react'
import { View, Text, FlatList } from 'react-native'
import ProfilePostListItem from './item'
import styles from './styles'

export default function ProfilePostList({ posts, onEndReached }) {
    return (
        <View style={styles.container}>
            <FlatList
                numColumns={3}
                removeClippedSubviews
                nestedScrollEnabled
                data={posts}
                onEndReached={onEndReached}
                keyExtractor={(item, index) => item.id + '' + index}
                renderItem={({ item }) => (<ProfilePostListItem item={item} />)}
            />
        </View>
    )
}
