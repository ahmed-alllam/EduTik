import React, { useEffect, useState } from 'react'
import { View, Image, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'
import { addComment, clearCommentListener, commentListner } from '../../../services/posts'
import CommentItem from './item'
import { generalStyles } from '../../../styles'
import {
    FlatList
  } from 'react-native-gesture-handler';

const CommentModal = ({ post }) => {
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState('')
    const currentUser = useSelector(state => state.auth.currentUser)

    useEffect(() => {
        console.log("allllam " , post.id)
        commentListner(post.id, (comments) => {
            setCommentList(comments);
        })
        return () => clearCommentListener()
    }, [])

    const handleCommentSend = () => {
        if (comment.length == 0 || !currentUser) {
            return;
        }
        setComment('')
        addComment(post.id, currentUser.uid, comment)
    }

    const renderItem = ({ item }) => {
        return <CommentItem item={item} />
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={commentList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            {currentUser ?
                <View style={styles.containerInput}>
                    <Image
                        style={generalStyles.avatarSmall}
                        source={{ uri: currentUser ? currentUser.photoURL : '' }}
                    />
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => handleCommentSend()}>
                        <Ionicons name="arrow-up-circle" size={34} color={'#f9d264'} />
                    </TouchableOpacity>
                </View>
                : null
            }
        </View>
    )
}

export default CommentModal
