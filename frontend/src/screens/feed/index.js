import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, View,} from 'react-native'
import useMaterialNavBarHeight from '../../hooks/useMaterialNavBarHeight'
import PostSingle from '../../components/general/post'
import { getFeed, getPostsByUserId } from '../../services/posts'
import styles from './styles'

/**
 * Component that renders a list of posts meant to be 
 * used for the feed screen.
 * 
 * On start make fetch for posts then use a flatList 
 * to display/control the posts.
 */
export default function FeedScreen({ route }) {
    const { setCurrentUserProfileItemInView, creator, profile, initCreation } = route.params
    const [posts, setPosts] = useState([])
    const mediaRefs = useRef([])
    const [lastVisible, setLastVisible] = useState(null);
    const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0)
    const [used, setUsed] = useState(false);
    const [iters, setIters] = useState(0);
    const [layoutHeight, setLayoutHeight] = useState(0);

    console.log('feed created');

    useEffect(() => {
        console.log('feed useEffect , length', posts.length);
        if (profile) {
            if (initCreation && !used) {
                let creationtemp = initCreation;
                creationtemp.seconds = creationtemp.seconds + 1;
                console.log('creationtemp', creationtemp);
                getPostsByUserId({ creation: creationtemp }, creator).then((newposts) => {
                    setPosts(newposts)
                    if (newposts.length > 0) {
                        // setLastVisible(newposts[newposts.length - 1])
                    }
                })
                setUsed(true);
            } else {
                getPostsByUserId(lastVisible, creator).then((newposts) => {
                    setPosts([...posts, ...newposts])

                    if (newposts.length > 0) {
                        // setLastVisible(newposts[newposts.length - 1])
                    } else {
                        // reiterate
                        getPostsByUserId(null, creator).then((newposts) => {
                            setIters(iters + 1);
                            newposts = newposts.map((post) => {
                                post.id = post.id + iters;
                                return post;
                            });
                            setPosts([...posts, ...newposts])
                            if (newposts.length > 0) {
                                // setLastVisible(newposts[newposts.length - 1])
                            }
                        }
                        )
                    }
                })
            }
        } else {
            getFeed(lastVisible).then((newposts) => {
                setPosts([...posts, ...newposts])

                if (newposts.length > 0) {
                    // setLastVisible(newposts[newposts.length - 1])
                } else {
                    // reiterate
                    getFeed(null).then((newposts) => {
                        setIters(iters + 1);
                        newposts = newposts.map((post) => {
                            post.id = post.id + iters;
                            return post;
                        });
                        setPosts([...posts, ...newposts])
                        if (newposts.length > 0) {
                            // setLastVisible(newposts[newposts.length - 1])
                        }
                    }
                    )
                }
            })
        }
    }, [lastVisible])

    const handleLoadMore = () => {
        console.log('handleLoadMore');
        setLastVisible(posts[posts.length - 1]);
    };


    /**
     * Called any time a new post is shown when a user scrolls
     * the FlatList, when this happens we should start playing 
     * the post that is viewable and stop all the others
     */
    const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentVisibleIndex(viewableItems[0].index)
            if (!profile) {
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
                style={{backgroundColor: 'black'}}
                data={posts}
                windowSize={4}
                initialNumToRender={0}
                maxToRenderPerBatch={2}
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
                keyExtractor={item => item.id}
                decelerationRate={'normal'}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged.current}
            />
        </View>
    )
}
