import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import styles from './style'


export default function AuthMenu({ authPage, setAuthPage, setDetailsPage }) {
    return (
        <View style={styles.container}>
            <View style={styles.containerMain}>
                {/* <Button
                    title={authPage == 0 ? 'Sign in with Google' : 'Sign up with Google'}
                    onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
                    
                /> */}
            </View>

            <TouchableOpacity style={styles.containerBottomButton}
                onPress={() => authPage == 0 ? setAuthPage(1) : setAuthPage(0)}>

                {authPage == 0 ?
                    <Text style={{fontFamily: 'Colton-Medium'}}>
                        Don't have an account? <Text style={styles.bottomButtonText}>Sign up</Text></Text>
                    :
                    <Text style={{fontFamily: 'Colton-Medium'}}>Already have an account? <Text style={styles.bottomButtonText}>Sign in</Text></Text>
                }
            </TouchableOpacity>

        </View>
    )
}
