"use strict"
const mongoCollections = require("../config/mongoCollections");
const uuid = require('node-uuid');
const users = mongoCollections.users;
const posts = mongoCollections.posts;

let exportedMethods = {
    getAllPosts(userId) {
        if (typeof userId !== "string" || !userId)
            return Promise.reject("No ID for the user provided");

        return posts().then((postsCollection) => {

            return postsCollection
                .find({ creator: userId })
                .toArray()
                .then((post) => {
                    if (post.length==0)
                        return [];
                    else
                        return post;
                });
        });
    },

    getPostById(creator, postId) {
        if (typeof postId !== "string" || !postId)
            return Promise.reject("No ID for the post provided");
        if (typeof creator !== "string" || !creator)
            return Promise.reject("No creator for the post provided");

        return posts().then((postsCollection) => {

            return postsCollection
                .findOne({ _id: postId, creator: creator})
                .then((post) => {
                    if (!post)
                        return Promise.reject("No post found");
                    return post;
                });
        });
    },

    addPost(post, creator, accounts, image) {
        if (typeof post !== "string" || !post)
            return Promise.reject("No text for the post provided");
        if (typeof creator !== "string" || !creator)
            return Promise.reject("No creator for the poster provided");
        if (!Array.isArray(accounts))
            return Promise.reject("No accounts for the post provided");
       
        return posts().then((postsCollection) => {
                    let newPost = {
                        _id: uuid.v4(),
                        creator: creator,
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

    removePost(creator, postId)
    {
        if (typeof postId !== "string" || !postId)
            return Promise.reject("No ID for the recipe provided to be deleted");
        if (typeof creator !== "string" || !creator)
            return Promise.reject("No creator for the post provided");

        return users().then((usersCollection) => {
            return usersCollection
                .removeOne({ _id: postId , creator: creator })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject("Could not delete the recipe");
                    } else { }
                });
        });
    }
}

module.exports = exportedMethods;