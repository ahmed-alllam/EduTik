
import storage from '@react-native-firebase/storage';


export const saveMediaToStorage = (media, path) => new Promise((resolve, reject) => {
    const fileRef = storage().ref().child(path)

    fetch(media)
        .then(response => {
            console.log("success 1: " + response);
            return response.blob()
        })
        .then(blob => {
            console.log("success 2: " + blob);
            return fileRef.put(blob)
        })
        .then(task => {
            console.log("success 3: " + task);
            return task.ref.getDownloadURL()
        })
        .then(downloadUrl => {
            console.log("success 4: " + downloadUrl);
            return resolve(downloadUrl)
        })
        .catch((error) => {
            console.log("error" + error);
            reject()
        })
})