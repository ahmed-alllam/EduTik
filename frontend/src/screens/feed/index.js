import React, { useEffect, useRef, useState } from 'react'
import { FlatList, View, } from 'react-native'
import useMaterialNavBarHeight from '../../hooks/useMaterialNavBarHeight'
import PostSingle from '../../components/general/post'
import { getFeed, getPostsByUserId, getPostById } from '../../services/posts'
import styles from './styles'

export default function FeedScreen({ route }) {
    const { setCurrentUserProfileItemInView, creator, profile, postID } = route.params
    const [posts, setPosts] = useState([])
    const mediaRefs = useRef([])
    const [lastVisible, setLastVisible] = useState(null);
    const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0)
    const [used, setUsed] = useState(false);
    const [layoutHeight, setLayoutHeight] = useState(0);
    const [profileEnded, setProfileEnded] = useState(false);
    const [postCreation, setPostCreation] = useState(null);


    useEffect(() => {
        if (postID && !used) {
            getPostById(postID).then((newposts) => {
                console.log('newposts', newposts);
                setPosts([newposts])
                setPostCreation(newposts.creation);
                setUsed(true);

                if (!newposts) {
                    if (profile) {
                        getPostsByUserId(null, creator).then((newposts) => {
                            setPosts(newposts)

                            if (newposts.length == 0) {
                                setProfileEnded(true);

                                getFeed(null).then((newposts) => {
                                    setPosts(newposts)
                                })
                            }
                        })
                    } else {
                        getFeed(null).then((newposts) => {
                            setPosts(newposts)
                        })
                    }
                }
            })
        } else {
            if (profile && !profileEnded) {
                getPostsByUserId(lastVisible, creator, postCreation).then((newposts) => {
                    console.log('newposts line 49', newposts);
                    setPosts([...posts, ...newposts])

                    if (newposts.length == 0) {
                        setProfileEnded(true);

                        getFeed(lastVisible, postCreation).then((newposts) => {
                            setPosts([...posts, ...newposts])

                            if (newposts.length == 0) {
                                getFeed(null).then((newposts) => {
                                    setPosts([...posts, ...newposts])
                                })
                            }
                        })
                    }
                })
            } else {
                getFeed(lastVisible, postCreation).then((newposts) => {
                    setPosts([...posts, ...newposts])

                    if (newposts.length == 0) {
                        // reiterate
                        getFeed(null).then((newposts) => {
                            setPosts([...posts, ...newposts])
                        })
                    }
                })
            }
        }
    }, [lastVisible])

    const handleLoadMore = () => {
        console.log('handleLoadMore');
        setLastVisible(posts[posts.length - 1]);
    };

    useEffect(() => {
        // when creator changes, reset the posts
        if (creator) {
            setPosts([])
            setLastVisible(null)
            setProfileEnded(false)
        }
    }, [creator])


    /**
     * Called any time a new post is shown when a user scrolls
     * the FlatList, when this happens we should start playing 
     * the post that is viewable and stop all the others
     */
    const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentVisibleIndex(viewableItems[0].index)
            if (!profile && setCurrentUserProfileItemInView) {
                setCurrentUserProfileItemInView(viewableItems[0].item.creator)
            }
        }
    });

    console.log('ahmed height', useMaterialNavBarHeight(profile));
    /**
     * renders the item shown in the FlatList
     * 
     * @param {Object} item object of the post 
     * @param {Integer} index position of the post in the FlatList 
     * @returns 
     */
    const renderItem = ({ item, index }) => {
        return (
            <View style={{ height: layoutHeight, backgroundColor: 'black' }}>
                <PostSingle item={item} index={index} currentVisibleIndex={currentVisibleIndex} ref={PostSingleRef => (mediaRefs.current[item.id] = PostSingleRef)} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: 'black' }}
                data={posts}
                windowSize={4}
                initialNumToRender={2}
                maxToRenderPerBatch={4}
                removeClippedSubviews
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setLayoutHeight(height);
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 90
                }}
                renderItem={renderItem}
                pagingEnabled
                // add random number to keyExtractor to force re-render
                keyExtractor={(item, index) => item.id + '' + index}
                decelerationRate={'normal'}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged.current}
            />
        </View>
    )
}
