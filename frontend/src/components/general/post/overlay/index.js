import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { getLikeById, updateLike } from "../../../../services/posts";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "throttle-debounce";
import { openCommentModal } from '../../../../redux/actions/modal';
import { useNavigation } from '@react-navigation/core';
// import react-native-share
import Share from 'react-native-share';

/**
 * Function that renders a component meant to be overlapped on
 * top of the post with the post info like user's display name and avatar
 * and the post's description
 *
 * @param {Object} user that created the post
 * @param {Object} post object
 */
export default function PostSingleOverlay({ user, post }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: post.likesCount,
  });

  useEffect(() => {

    if (!currentUser) return

    getLikeById(post.id, currentUser.uid).then((res) => {
      setCurrentLikeState({
        ...currentLikeState,
        state: res,
      });
    });
  }, []);

  /**
   * Handles the like button action.
   *
   * In order to make the action more snappy the like action
   * is optimistic, meaning we don't wait for a response from the
   * server and always assume the write/delete action is successful
   */
  const handleUpdateLike = useMemo(
    () =>
      throttle(500, true, (currentLikeStateInst) => {
        if (!currentUser) return;

        setCurrentLikeState({
          state: !currentLikeStateInst.state,
          counter:
            currentLikeStateInst.counter +
            (currentLikeStateInst.state ? -1 : 1),
        });

        updateLike(post.id, currentUser.uid, currentLikeStateInst.state);
      }),
    []
  );


  const handleShare = () => {
    // implement share

    let message = `Check out this video about ${post.description} on EduTik!`;
    let url = "https://edutik.page.link/" + post.id;

    const shareOptions = {
      title: 'Share EduTik video via',
      message: message,
      url: url,
    }

    Share.open(shareOptions)
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });
  };
  

  return (
    <View style={styles.container}>
      <View style={{ flex: 17 }}>
        <Text style={styles.displayName}>{user?.displayName}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>

      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('profileOther', { initialUserId: user?.uid })}>
          <Image style={styles.avatar} source={{ uri: user?.photoURL }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateLike(currentLikeState)}
        >
          <Ionicons
            color="white"
            size={40}
            style={styles.actionButtonIcon}
            name={currentLikeState.state ? "heart" : "heart-outline"}
          />
          <Text style={styles.actionButtonText}>
            {currentLikeState.counter}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare()}
        >
          <Ionicons
            color="white"
            size={45}
            style={styles.actionButtonIcon}
            name={"arrow-redo"}
          />

          <Text style={styles.actionButtonText}>
            Share
          </Text>        
          
          </TouchableOpacity>


        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch(openCommentModal(true, post))}
        >
          <Ionicons
            color="white"
            size={40}
            style={styles.actionButtonIcon}
            name={"chatbubble"}
          />
          <Text style={styles.actionButtonText}>
            {post.commentsCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
