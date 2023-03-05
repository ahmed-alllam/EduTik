// write a script to donwload videos from a link in firebase firestore posts
// then upload the video to bunny cdn
// it is not a firebase function, it is a script to run on a server

const admin = require('firebase-admin');
const serviceAccount = require('./edutik-930c1-firebase-adminsdk-ebh2a-e6add83b02.json');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Form = require('form-data');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://edutik-930c1.firebaseio.com'
});

const db = admin.firestore();

const download = async (doc, path) => {
    const media = doc.data().media;

    if (!media || media.length < 2) {
        console.log('No media found for post', doc.id);
        return;
    }

    // Download video
    const videoUrl = media[0];
    const videoPath = `${path}${doc.id}.mp4`;
    const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream',
    });

    const videoWriter = fs.createWriteStream(videoPath);
    videoResponse.data.pipe(videoWriter);
    await new Promise((resolve, reject) => {
        videoWriter.on('finish', resolve);
        videoWriter.on('error', reject);
    });

    console.log('Downloaded video', videoUrl, 'to', videoPath);

    // Download thumbnail
    const thumbnailUrl = media[1];
    const thumbnailPath = `${path}${doc.id}.jpg`;
    const thumbnailResponse = await axios({
        method: 'get',
        url: thumbnailUrl,
        responseType: 'stream',
    });

    const thumbnailWriter = fs.createWriteStream(thumbnailPath);
    thumbnailResponse.data.pipe(thumbnailWriter);
    await new Promise((resolve, reject) => {
        thumbnailWriter.on('finish', resolve);
        thumbnailWriter.on('error', reject);
    });

    console.log('Downloaded thumbnail', thumbnailUrl, 'to', thumbnailPath);

    // Upload to Bunny CDN
    const url = 'https://storage.bunnycdn.com/edutik2/';
    const accessKey = '46e5aab6-cca5-4924-ba7ee9091414-6762-49a8';

    const headers = {
        'AccessKey': accessKey,
        'Content-Type': 'application/octet-stream'
    };

    axios({
        method: 'PUT',
        url: url + 'videos/' + doc.id + '.mp4',
        headers: headers,
        data: fs.readFileSync(videoPath)
    })
        .then((response) => {
            console.log('Video Done');
        })
        .catch((error) => {
            console.log(error);
        });

    axios({
        method: 'PUT',
        url: url + 'thumbnails/' + doc.id + '.jpg',
        headers: headers,
        data: fs.ReadStream(thumbnailPath)
    })
        .then((response) => {
            console.log('Thumnail Done');
        }
        )
        .catch((error) => {
            console.log(error);
        });
}

console.log('Starting script');

const posts = db.collection('post');
posts.where('verified', '==', true).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            // download(doc, './test/');
            // change doc
            
            const data = doc.data();
            data.media = [
                `https://edutik3.b-cdn.net/videos/${doc.id}.mp4`,
                'https://edutik3.b-cdn.net/thumbnails/' + doc.id + '.jpg'
            ];
            posts.doc(doc.id).set(data);

            console.log('Updated post', doc.id);
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
