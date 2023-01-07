import { Video } from 'expo-av'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Dimensions, View, Text } from 'react-native'
import { useUser } from '../../../hooks/useUser'
import PostSingleOverlay from './overlay'
import styles from './styles'
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";

/**
 * This component is responsible for displaying a post and play the 
 * media associated with it.
 * 
 * The ref is forwarded to this component so that the parent component
 * can manage the play status of the video.
 */
export const PostSingle = forwardRef(({ item, index, currentVisibleIndex }, parentRef) => {
    const ref = useRef(null);
    const user = useUser(item.creator).data
    const screenIsFocused = useIsFocused();
    const [isPlaying, setIsPlaying] = useState(true);

    useImperativeHandle(parentRef, () => ({
        play,
        unload,
        stop
    }))

    useEffect(() => {
        return () => unload();
    }, [])


    /**
     * Plays the video in the component if the ref
     * of the video is not null.
     * 
     * @returns {void} 
     */
    const play = async () => {
        if (ref.current == null) {
            return;
        }

        // if video is already playing return
        const status = await ref.current.getStatusAsync();
        if (status?.isPlaying) {
            return;
        }
        try {
            await ref.current.playAsync();
        } catch (e) {
            console.log(e)
        }
    }


    /**
     * Stops the video in the component if the ref
     * of the video is not null.
     * 
     * @returns {void} 
     */
    const stop = async () => {
        if (ref.current == null) {
            return;
        }

        // if video is already stopped return
        const status = await ref.current.getStatusAsync();
        if (!status?.isPlaying) {
            return;
        }
        try {
            await ref.current.stopAsync();
        } catch (e) {
            console.log(e)
        }
    }

    const togglePlayPause = () => {
        console.log('ahmed toggle play pause');
        if (isPlaying) {
            ref.current.pauseAsync();
        } else {
            ref.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };


    /**
     * Unloads the video in the component if the ref
     * of the video is not null.
     * 
     * This will make sure unnecessary video instances are
     * not in memory at all times 
     * 
     * @returns {void} 
     */
    const unload = async () => {
        if (ref.current == null) {
            return;
        }

        // if video is already stopped return
        try {
            await ref.current.unloadAsync();
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <PostSingleOverlay user={user} post={item} />
            <Ionicons
                color="white"
                size={100}
                name="play"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{ translateX: -50 }, { translateY: -50 }],
                    opacity: isPlaying ? 0 : 1,
                    zIndex: 1000
                }}
            />
            <TouchableOpacity activeOpacity={1} style={{ height: '100%' }} onPress={togglePlayPause}>
                <Video
                    ref={ref}
                    style={styles.container}
                    resizeMode={Video.RESIZE_MODE_COVER}
                    shouldPlay={isPlaying && screenIsFocused && index === currentVisibleIndex}
                    isLooping
                    usePoster
                    posterSource={{ uri: item.media[1] }}
                    posterStyle={{ resizeMode: 'cover', height: '100%' }}
                    source={{ uri: item.media[0] }} />
            </TouchableOpacity>
        </>
    )
})

export default PostSingle