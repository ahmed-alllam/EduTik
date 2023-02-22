
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { USER_STATE_CHANGE } from '../constants'
import { getPostsByUser } from './post'

export const userAuthStateListener = () => dispatch => {
    auth().onAuthStateChanged((user) => {
        if (user) {
            dispatch(getCurrentUserData())
            dispatch(getPostsByUser(auth().currentUser.uid))
        } else {
            dispatch({ type: USER_STATE_CHANGE, currentUser: null, loaded: true })
        }
    })
}

export const getCurrentUserData = () => dispatch => {
    firestore()
        .collection('user')
        .doc(auth().currentUser.uid)
        .onSnapshot((res) => {
            if (res.exists) {
                return dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: res.data(),
                    loaded: true
                })
            }
        })
}

export const login = (email, password) => dispatch => new Promise((resolve, reject) => {
    auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            resolve()
        })
        .catch(() => {
            reject()
        })
})

export const register = (name, email, password) => dispatch => new Promise((resolve, reject) => {
    auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            firestore().collection('user').doc(user.user.uid)
                .set({
                    displayName: name,
                    photoURL: 'https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?fit=300%2C300&ssl=1',
                    score: 0,
                    uid: user.user.uid,
                    email: email,
                    bio: '',
                })
        })
        .then(() => {
            auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                })
        })
        .then(() => {
            resolve()
        })
        .catch((error) => {
            console.log(error)
            reject(error)
        })
})