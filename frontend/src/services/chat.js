import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export const chatsListener = (listener) => {
    firestore()
        .collection('chats')
        .where('members', 'array-contains', auth().currentUser.uid)
        .orderBy('lastUpdate', 'desc')
        .onSnapshot(listener)
}

export const messagesListener = (listener, chatId) => {
    firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('creation', 'desc')
        .onSnapshot(listener)
}

export const sendMessage = (chatId, message) => {
    firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
            creator: auth().currentUser.uid,
            message,
            creation: firestore.FieldValue.serverTimestamp()
        })
    firestore()
        .collection('chats')
        .doc(chatId)
        .update({
            lastUpdate: firestore.FieldValue.serverTimestamp(),
            lastMessage: message,
        })
}

export const createChat = (contactId) => new Promise((resolve, reject) => {
    firestore()
        .collection('chats')
        .add({
            lastUpdate: firestore.FieldValue.serverTimestamp(),
            lastMessage: 'Send a first message',
            members: [contactId, auth().currentUser.uid]
        })
        .then(resolve)
        .catch(reject)
})


