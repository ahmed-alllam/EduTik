import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Button } from 'react-native'
import styles from './styles'
import { useSelector } from 'react-redux'
import Leaderboard from 'react-native-leaderboard'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons';

const AwardsScreen = () => {
    const [data, setData] = useState([])
    const auth = useSelector((state) => state.auth);
    // get the rank of the current user
    const [rank, setRank] = useState(0)
    // get the prizes
    const [prizes, setPrizes] = useState([]);
    const navigation = useNavigation()

    useEffect(() => {
        firestore()
            .collection('user')
            .orderBy('score', 'desc')
            .onSnapshot((querySnapshot) => {
                if (querySnapshot.metadata.fromCache) {
                    return;
                }
                const data = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    key: doc.id,
                }))
                setData(data)
            });
    }, [])

    useEffect(() => {
        if (auth && auth.currentUser) {
            firestore()
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
        firestore()
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

    const goToAuth = () => {
        navigation.navigate('Auth')
    }

    return (
        <ScrollView style={styles.container}>
            <View colors={[, '#f9d264', '#f9d264']}
                style={{ backgroundColor: '#f9d264', padding: 15, paddingTop: 35, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Colton-Black', marginTop:15, fontSize: 25, color: 'white', }}>Awards</Text>
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
                                <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Colton-Semi-Bold' }}>
                                    {auth.currentUser.displayName}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10, justifyContent: 'space-between', width:'100%'}}>
                                <Text style={{ color: 'white',flex:1,  fontSize: 25, marginLeft: 20 , fontFamily: 'Colton-Semi-Bold',  textAlign:'left'}}>
                                    Rank: #{rank}
                                </Text>

                                <Text style={{ color: 'white', flex:1, fontSize: 25, marginRight: 20, fontFamily: 'Colton-Semi-Bold', textAlign: 'right'}}>
                                    {auth.currentUser.score} Points
                                </Text>
                            </View>
                        </>
                    ) : (
                        <View>
                            <TouchableOpacity onPress={goToAuth} style={styles.createAccountButton} >
                                <Feather name="user-plus" size={24} color="white" />
                                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginLeft: 5, fontFamily: 'Colton-Black' }}>Create an account to receive points!</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </View>


            <Text style={{ fontSize: 18, textAlign: 'center', marginHorizontal: 30, marginTop: 30, marginBottom: 10, color: '#f9d264', fontFamily: 'Colton-Black' }}>Post Educational Videos to redeem Awards!</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginBottom: 20 }}
            >
                {prizes.map(prize => (
                    <View key={prize.id} style={styles.prizeContainer}>
                        <Image source={{ uri: prize.imageUrl }} style={styles.prizeImage} />
                        <Text style={styles.prizeName}>{prize.name}</Text>
                        <Text style={styles.prizeDescription}>{prize.description}</Text>
                    </View>
                ))}
            </ScrollView>

            <Text style={{ fontSize: 25, textAlign: 'center', marginHorizontal: 30, marginTop: 15, marginBottom: 30, color: '#f9d264', fontFamily: 'Colton-Black' }}>Leaderboard</Text>

            <Leaderboard
                data={data.slice(0, 5)}
                sortBy='score'
                labelBy='displayName'
                labelStyle={{ fontFamily: 'Colton-Semi-Bold', fontSize:18 }}
            />

        </ScrollView>
    )
}

export default AwardsScreen
