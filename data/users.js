const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },

    getUserById(id) {
        if (typeof id !== "string" || !id)
            return Promise.reject("No ID for the user provided");
        return users().then((usersCollection) => {
            return usersCollection
                .findOne({ _id: id })
                .then((user) => {
                    if (!user)
                        return Promise.reject("No user found");
                    return user;
                });
        });
    },

    addUser(username, email, password) {
        if (typeof username !== "string" || !username)
            return Promise.reject("No username provided");
        if (typeof email !== "string" || !email)
            return Promise.reject("No email provided");
        if (typeof password !== "string" || !password)
            return Promise.reject("No password provided");

        return users().then((usersCollection) => {

            return usersCollection.findOne({ username: username }).then((user) => {
                if (user != null)
                    return Promise.reject("Sorry, this username is taken.");

                return usersCollection.findOne({ email: email }).then((user) => {
                    if (user != null)
                        return Promise.reject("An account with this email address already exists.");

                    let hashedPassword = bcrypt.hashSync(password, saltRounds);

                    let newUser = {
                        _id: uuid.v4(),
                        username: username,
                        email: email,
                        password: hashedPassword,
                        accounts: []
                    };

                    return usersCollection.insertOne(newUser).then((newInsertInformation) => {
                        if (newInsertInformation.result.ok !== 1) {
                            return Promise.reject("Could not execute the command");
                        }
                        else
                            return true;
                    });
                });
            });
        });
    },

    login(username, password) {
        if (typeof username !== "string" || !username)
            return Promise.reject("No username provided");
        if (typeof password !== "string" || !password)
            return Promise.reject("No password provided");

        return users().then((usersCollection) => {
            return usersCollection.findOne({ username: username }).then((user) => {
                if (user == null)
                    return Promise.reject("Sorry, this username does not exist");
                else {
                    return bcrypt.compareSync(password, user.password);
                }
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
    },

    removeUser(userId) {
        if (typeof userId !== "string" || !userId)
            return Promise.reject("No ID for the user provided to be deleted");
        return users().then((usersCollection) => {
            return usersCollection
                .removeOne({ _id: userId })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject("Could not delete the user");
                    } else { }
                });
        });
    },
    
    // For debugging purposes. To be removed later.
    removeAllUsers() {
        return users().then((usersCollection) => {
            return usersCollection
                .deleteMany({ })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject("Could not delete the user");
                    } else { }
                });
        });
}
}
module.exports = exportedMethods;