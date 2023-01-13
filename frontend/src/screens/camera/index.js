import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, Button, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import * as VideoThumbnails from 'expo-video-thumbnails';

import { useIsFocused } from '@react-navigation/core'
import { Feather } from '@expo/vector-icons'

import styles from './styles'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'


/**
 * Function that renders a component responsible showing
 * a view with the camera preview, recording videos, controling the camera and
 * letting the user pick a video from the gallery
 * @returns Functional Component
 */
export default function CameraScreen() {
    const [hasCameraPermissions, setHasCameraPermissions] = useState(false)
    const [hasAudioPermissions, setHasAudioPermissions] = useState(false)
    const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false)
    const currentUserObj = useSelector(state => state.auth);

    const [galleryItems, setGalleryItems] = useState([])

    const [cameraRef, setCameraRef] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [cameraFlash, setCameraFlash] = useState(Camera.Constants.FlashMode.off)

    const [isCameraReady, setIsCameraReady] = useState(false)
    const isFocused = useIsFocused()

    const navigation = useNavigation()
    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync()
            setHasCameraPermissions(cameraStatus.status == 'granted')

            const audioStatus = await Audio.requestPermissionsAsync()
            setHasAudioPermissions(audioStatus.status == 'granted')

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermissions(galleryStatus.status == 'granted')

            if (galleryStatus.status == 'granted') {
                const userGalleryMedia = await MediaLibrary.getAssetsAsync({ sortBy: ['creationTime'] })
                setGalleryItems(userGalleryMedia.assets)
            }
        })()
    }, [])

    const goToAuth = () => {
        navigation.navigate('Auth')
    }

    if (!currentUserObj.currentUser) {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={goToAuth} style={styles.createAccountButton} >
                    <Feather name="user-plus" size={24} color="white" />
                    <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginLeft: 5 , fontFamily: 'Colton-Black' }}>Create an account to post videos</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const recordVideo = async () => {
        if (cameraRef) {
            try {
                const options = { maxDuration: 90, quality: Camera.Constants.VideoQuality['480'] }
                const videoRecordPromise = cameraRef.recordAsync(options)
                if (videoRecordPromise) {
                    const data = await videoRecordPromise;
                    const source = data.uri
                    let sourceThumb = await generateThumbnail(source)
                    navigation.navigate('savePost', { source, sourceThumb })
                }
            } catch (error) {
                console.warn(error)
            }
        }
    }

    const stopVideo = async () => {
        if (cameraRef) {
            cameraRef.stopRecording()
        }
    }

    const pickFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1
        })
        if (!result.cancelled) {
            if (result.duration > 90000) {
                Alert.alert('Video too long', 'Please select a video that is less than 90 seconds long')
                console.log('Video too long')
                return
            }

            let sourceThumb = await generateThumbnail(result.uri)
            navigation.navigate('savePost', { source: result.uri, sourceThumb })
        }
    }

    const generateThumbnail = async (source) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                source,
                {
                    time: 5000,
                }
            );
            return uri;
        } catch (e) {
            console.warn(e);
        }
    };

    if (!hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions) {
        return (
            <View style={styles.container2}>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginLeft: 5 , fontFamily: 'Colton-Black' }}>
                    Please enable camera permissions from your settings </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {isFocused ?
                <Camera
                    ref={ref => setCameraRef(ref)}
                    style={styles.camera}
                    ratio={'16:9'}
                    type={cameraType}
                    flashMode={cameraFlash}
                    onCameraReady={() => setIsCameraReady(true)}
                />
                : null}

            <View style={styles.sideBarContainer}>
                <TouchableOpacity
                    style={styles.sideBarButton}
                    onPress={() => setCameraType(cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>

                    <Feather name="refresh-ccw" size={24} color={'white'} />
                    <Text style={styles.iconText}>Flip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sideBarButton}
                    onPress={() => setCameraFlash(cameraFlash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off)}>

                    <Feather name="zap" size={24} color={'white'} />
                    <Text style={styles.iconText}>Flash</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.bottomBarContainer}>
                <View style={{ flex: 1 }}></View>
                <View style={styles.recordButtonContainer}>
                    <TouchableOpacity
                        disabled={!isCameraReady}
                        onLongPress={() => recordVideo()}
                        onPressOut={() => stopVideo()}
                        style={styles.recordButton}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => pickFromGallery()}
                        style={styles.galleryButton}>
                        {galleryItems[0] == undefined ?
                            <></>
                            :
                            <Image
                                style={styles.galleryButtonImage}
                                source={{ uri: galleryItems[0].uri }}
                            />}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
