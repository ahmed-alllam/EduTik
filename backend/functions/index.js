const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const urlBuilder = require('build-url');
const request = require('request-promise');

const db = admin.firestore()


exports.likeCreate = functions.firestore.document('post/{id}/{type}/{uid}').onCreate((_, context) => {
    let updateObj = {}
    if (context.params.type == 'comments') {
        updateObj = {
            commentsCount: admin.firestore.FieldValue.increment(1)
        }
    }
    if (context.params.type == 'likes') {
        updateObj = {
            likesCount: admin.firestore.FieldValue.increment(1)
        }
    }
    return db
        .collection("post")
        .doc(context.params.id)
        .update(updateObj)
})

exports.likeDelete = functions.firestore.document('post/{id}/{type}/{uid}').onDelete((_, context) => {
    let updateObj = {}
    if (context.params.type == 'comments') {
        updateObj = {
            commentsCount: admin.firestore.FieldValue.increment(-1)
        }
    }
    if (context.params.type == 'likes') {
        updateObj = {
            likesCount: admin.firestore.FieldValue.increment(-1)
        }
    }
    return db
        .collection("post")
        .doc(context.params.id)
        .update(updateObj)
})



exports.postDynamicLink2 = functions.firestore.document('post/{id}').onCreate((event, context) => {
        const post = event.data();

        if (post.addedDynamicLink) {
            return;
        }

        post.addedDynamicLink = true;

        const socialTitle = post.description;
        const socialDescription = `Check out this video about ${post.description} on EduTik.`;
        const socialImageUrl = post.media[1];

        const options = {
            method: 'POST',
            uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyCRzDH6m4V_hQTE5-O3BlKzpFXsnHiTezc`,
            body: {
                "longDynamicLink": makeDynamicLongLink(post.id, socialTitle, socialDescription, socialImageUrl)
            },
            json: true
        };

        return request(options)
            .then(function (parsedBody) {
                console.log(parsedBody);
                return parsedBody.shortLink;
            })
            .then((shortLink) => {
                post.shareUrl = shortLink;
                console.log('short link: ' + shortLink);
                return db.collection('post').doc(context.params.id).update(post);
            })
            .catch(function (err) {
                console.log(err);
            }
        );

    });


function makeDynamicLongLink(postId, socialTitle, socialDescription, socialImageUrl) {
    return urlBuilder(`https://edutik.page.link`, {
        queryParams: {
            link: "https://edutik.site/" + postId,
            apn: "com.edutik.app",
            afl: "https://play.google.com/store/apps/details?id=com.edutik.app",
            st: socialTitle,
            sd: socialDescription,
            si: socialImageUrl
        }
    });
}