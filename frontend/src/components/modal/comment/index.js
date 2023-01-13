import React, { useEffect, useState } from 'react'
import { View, Image, TextInput, TouchableOpacity, Text } from 'react-native'
import { useSelector } from 'react-redux'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'
import { addComment, clearCommentListener, commentListner } from '../../../services/posts'
import CommentItem from './item'
import { generalStyles } from '../../../styles'
import { clearModal } from '../../../redux/actions/modal';
import {
    FlatList
} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';

const CommentModal = ({ post, navigation }) => {
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState('')
    const currentUser = useSelector(state => state.auth.currentUser)
    const dispatch = useDispatch();

    const goToAuth = () => {
        navigation?.navigationRef?.current?.navigate('Auth')
        dispatch(clearModal())
    }

    useEffect(() => {
        console.log("allllam ", post.id)
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
                :
                <View>
                    <TouchableOpacity onPress={goToAuth} style={styles.createAccountButton} >
                        <Feather name="user-plus" size={22} color="white" />
                        <Text style={{ color: 'white', fontSize: 15, textAlign: 'center', marginLeft: 5, fontFamily: 'Colton-Black' }}>Create an account to comment</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default CommentModal
