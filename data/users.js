const mongoCollections = require("../config/mongoCollections");
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');
const users = mongoCollections.users;
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

    getUserByName(username) {
        if (typeof username !== "string" || !username)
            return Promise.reject("No username provided");
        return users().then((usersCollection) => {
            return usersCollection
                .findOne({ username: username })
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

    //TODO: need a method to change a user email/password
    updateUser(userId, username, email, password ){
        return Promise.reject("Not implemented yet");
    },

    //TODO: need a method to change the set of accounts for a user
    updateUserAccounts(userId, accounts){
        return Promise.reject("Not implemented yet");
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
                    if (!bcrypt.compareSync(password, user.password)) {
                        return Promise.reject("Bad username or password! Hint: Password must be at least 8 characters long with at least 1 number, 1 lowercase character and 1 uppercase character.");
                    }
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