import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import styles from './styles'
import { useSelector } from 'react-redux'
import Leaderboard from 'react-native-leaderboard'
import firebase from 'firebase'

const AwardsScreen = () => {
    const [data, setData] = useState([])
    const auth = useSelector((state) => state.auth);
    // get the rank of the current user
    const [rank, setRank] = useState(0)
    // get the prizes
    const [prizes, setPrizes] = useState([]);

    useEffect(() => {
        firebase.firestore()
            .collection('user')
            .orderBy('score', 'desc')
            .onSnapshot((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    key: doc.id,
                }))
                setData(data)
            });
    }, [])

    useEffect(() => {
        if (auth && auth.currentUser) {
            firebase.firestore()
                .collection('user')
                .orderBy('score', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        key: doc.id,
                    }))
                    let rank = 0
                    data.forEach((user, index) => {
                        if (user.key == auth.currentUser.uid) {
                            rank = index + 1
                        }
                    })
                    setRank(rank)
                })
        }
    }, [auth])

    useEffect(() => {
        firebase.firestore()
            .collection('prizes')
            .orderBy('score', 'asc')
            .onSnapshot((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    key: doc.id,
                }))
                setPrizes(data)
            });
    }, [])

    return (
        <ScrollView style={styles.container}>
            <View colors={[, '#1da2c6', '#1695b7']}
                style={{ backgroundColor: '#119abf', padding: 15, paddingTop: 35, alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: 'white', }}>Leaderboard</Text>
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    marginBottom: 15, marginTop: 20
                }}>
                    {auth && auth.currentUser ? (
                        <>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Image style={{ height: 100, width: 100, borderRadius: 50 }}
                                    source={{ uri: auth.currentUser.photoURL }} />

                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{color: 'white', fontSize: 18}}>
                                    {auth.currentUser.displayName}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 50 }}>
                                    Rank: #{rank}
                                </Text>

                                <Text style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 50 }}>
                                    {auth.currentUser.score} pts
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
                            Log in to see your rank and receive awards</Text>
                    )}

                </View>
            </View>


            <Leaderboard
                data={
                    [
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },
                        {
                            key: 1,
                            displayName: 'John',
                            score: 100
                        },

                    ]
                    .slice(0, 5)}
                sortBy='score'
                labelBy='displayName'
            />

            <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 30, marginBottom: 10, fontWeight: 'bold', color: '#1da2c6' }}>Post videos to redeem awards!</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginBottom: 20 }}
            >
                {[
                    {
                        key: 1,
                        name: 'Free Coffee',
                        description: 'Get a free coffee at any Starbucks if you have 100 points',
                        imageUrl: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-sliced-into-six-slices_141793-2157.jpg?w=2000'
                    },
                    {
                        key: 2,
                        name: 'Free Pizza',
                        description: 'Get a free pizza at any Pizza Hut if you have 200 points',
                        imageUrl: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-sliced-into-six-slices_141793-2157.jpg?w=2000'
                    },
                    {
                        key: 3,
                        name: 'Free Movie',
                        description: 'Get a free pizza at any Pizza Hut if you have 200 points',
                        imageUrl: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-sliced-into-six-slices_141793-2157.jpg?w=2000'

                    },
                    {
                        key: 4,
                        description: 'Get a free pizza at any Pizza Hut if you have 200 points',
                        name: 'Free Game',
                        imageUrl: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-sliced-into-six-slices_141793-2157.jpg?w=2000'
                    },
                ].map(prize => (
                    <View key={prize.id} style={styles.prizeContainer}>
                        <Image source={{ uri: prize.imageUrl }} style={styles.prizeImage} />
                        <Text style={styles.prizeName}>{prize.name}</Text>
                        <Text style={styles.prizeDescription}>{prize.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    )
}

export default AwardsScreen
