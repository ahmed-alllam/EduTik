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
        <View style={styles.container}>
            <View colors={[, '#1da2c6', '#1695b7']}
                style={{ backgroundColor: '#119abf', padding: 15, paddingTop: 35, alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: 'white', }}>Leaderboard</Text>
                <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    marginBottom: 15, marginTop: 20
                }}>
                    {auth && auth.currentUser ? (
                        <>
                            <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                                Rank: #{rank}
                            </Text>
                            <Image style={{ flex: .66, height: 60, width: 60, borderRadius: 60 / 2 }}
                                source={{ uri: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-braindead-zombie.png' }} />
                            <Text style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 40 }}>
                                {auth.currentUser.score} pts
                            </Text>
                        </>
                    ) : (
                        <Text>Log in to see your rank and receive awards</Text>
                    )}

                </View>
            </View>

            <Leaderboard
                data={data}
                sortBy='score'
                labelBy='displayName'
            />

            <Text style={{ marginLeft: 20, fontSize: 16 }}>Post and watch short videos to earn more coins and awards</Text>
            
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20 }}
            >

                {prizes.map(prize => (
                    <View style={{ marginRight: 20 }}>
                        <Image source={{ uri: prize.imageUrl }} style={{ width: 150, height: 150 }} />
                        <Text style={{ fontSize: 16 }}>{prize.name}</Text>
                        <Text style={{ fontSize: 16 }}>{prize.score}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default AwardsScreen
