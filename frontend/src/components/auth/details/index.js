import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, CheckBox } from 'react-native'
import { Feather } from '@expo/vector-icons';
import styles from './style';
import { useDispatch } from 'react-redux'
import { login, register } from '../../../redux/actions';
import { Linking } from 'react-native';

/**
 * Function that renders a component that renders a signin/signup
 * form.
 * 
 * @param props passed to component 
 * @param props.authPage if 0 it is in the signin state
 * if 1 is in the signup state 
 * @param props.setDetailsPage setter for the variable that chooses 
 * the type of page, if true show AuthMenu else show AuthDetails 
 * @returns Component 
 */
export default function AuthDetails({ authPage, setDetailsPage }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [privacyChecked, setPrivacyChecked] = useState(false)

    const dispatch = useDispatch()

    /**
     * dispatch login action
     */
    const handleLogin = () => {
        setError('')

        dispatch(login(email, password))
            .then(() => {
                console.log('login successful')
            })
            .catch((err) => {
                if (email == '' || password == '') {
                    setError('Please fill in all fields')
                } else {
                    setError('Wrong email or password')
                }
            })
    }

    /**
     * dispatch register action
     */
    const handleRegister = () => {
        setError('')

        if (name == '') {
            setError('Please fill in all fields')
            return
        }

        if (!privacyChecked) {
            setError('Please agree to the privacy policy')
            return
        }

        dispatch(register(name, email, password))
            .then(() => {
                console.log('register successful')
            })
            .catch(() => {
                if (email == '' || password == '') {
                    setError('Please fill in all fields')
                } else {
                    setError('An Error occured, Try a different email and password')
                }
            })
    }

    const openPrivacyPage = () => {

        Linking.openURL("https://www.privacypolicygenerator.info/live.php?token=dwkz0VWYmkKQdgAHYrzH4ZIS3whTTHjC").catch(err => console.error("Couldn't load page", err));

    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{authPage == 0 ? 'Sign in' : 'Sign up'}</Text>

            {authPage == 1 ? (
                <View>
                    <TextInput style={styles.textInput} placeholder='Name' onChangeText={(text) => setName(text)} />
                </View>
            ) : null}

            <TextInput
                onChangeText={(text) => setEmail(text)}
                style={styles.textInput}
                placeholder='Email'
            />
            <TextInput
                onChangeText={(text) => setPassword(text)}
                style={styles.textInput}
                secureTextEntry
                placeholder='Password'
            />

            {authPage == 1 ? (
                <View style={styles.privacyContainer}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
                        onPress={() => setPrivacyChecked(!privacyChecked)}
                    >
                        {privacyChecked ? (
                            <Feather name="check-square" size={24} color="#efcb00" style={{marginRight:5}}  />
                        ) : (
                            <Feather name="square" size={24} color="grey" style={{marginRight:5}} />
                        )}

                        <Text style={{fontFamily: 'Colton-Semi-Bold', color: 'black'}}>
                            I agree to the
                            <Text style={{ color: '#efcb00' }}
                                onPress={() => openPrivacyPage()}> privacy policy
                            </Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            ) : null}

            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => authPage == 0 ? handleLogin() : handleRegister()}>
                <Text style={styles.buttonText}>{authPage == 0 ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
        </View >
    )
}
