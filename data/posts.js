const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const posts = mongoCollections.posts;


const uuid = require('node-uuid');

let exportedMethods = {
    getAllPosts(userId) {
        if (typeof userId !== "string" || !userId)
            return Promise.reject("No ID for the user provided");

        return posts().then((postsCollection) => {

            return postsCollection
                .find({ posterId: userId })
                .toArray()
                .then((post) => {
                    if (post.length==0)
                        return [];
                    else
                        return post;
                });
        });
    },

    getPostById(userId, postId) {
        //TODO: check userId submitted against the userId of the post, must be equal before returning
        if (typeof postId !== "string" || !postId)
            return Promise.reject("No ID for the post provided");

        return posts().then((postsCollection) => {

            return postsCollection
                .findOne({ _id: postId })
                .then((post) => {
                    if (!post)
                        return Promise.reject("No post found");
                    return post;
                });
        });
    },

    addPost(post, posterId, accounts, image) {
        if (typeof post !== "string" || !post)
            return Promise.reject("No text for the post provided");
        if (typeof posterId !== "string" || !posterId)
            return Promise.reject("No ID for the poster provided");
        if (accounts.constructor === Array || !accounts)
            return Promise.reject("No accounts for the post provided");
       
        return posts().then((postsCollection) => {
                    let newPost = {
                        _id: uuid.v4(),
                        posterId: posterId,
                        post: post,
                        image: image,
                        // imageType: image/png,
                        posts: accounts
                    };

                    return postsCollection.insertOne(newPost).then((newInsertInformation) => {
                        if (newInsertInformation.result.ok !== 1) {
                            return Promise.reject("Could not execute the command");
                        }
                        else
                            return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return this.getPostById(newId);
                    });
         });
    },

    removePost(userId, postId)
    {
        //TODO: check userId submitted against the userId of the post, must be equal before deleting
        if (typeof postId !== "string" || !postId)
            return Promise.reject("No ID for the recipe provided to be deleted");
        return users().then((usersCollection) => {
            return usersCollection
                .removeOne({ _id: postId })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject("Could not delete the recipe");
                    } else { }
                });
        });
    }
}

module.exports = exportedMethods;