const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const auth = require('../auth')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    console.log('NEW PLAYLIST BODY: ', body);
    
    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        console.log('Playlist info missing...');
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        // console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        playlist.ownerUsername = user.userName;
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        console.log('Error creating playlist')
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}

deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, async (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("Delete playlist from user: ", user.playlists);
                    user.playlists = user.playlists.filter((id) => id != req.params.id);
                    console.log("Deleted playlist from user: ", user.playlists);
                    await user.save();
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({ id: req.params.id });
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}

getPlaylistById = async (req, res) => {
    // if(auth.verifyUser(req) === null){
    //     return res.status(400).json({
    //         errorMessage: 'UNAUTHORIZED'
    //     })
    // }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));
        return res.status(200).json({ success: true, playlist: list })

        // DOES THIS LIST BELONG TO THIS USER?
        // async function asyncFindUser(list) {
        //     await User.findOne({ email: list.ownerEmail }, (err, user) => {
        //         console.log("user._id: " + user._id);
        //         console.log("req.userId: " + req.userId);
        //         if (user._id == req.userId) {
        //             console.log("correct user!");
        //             return res.status(200).json({ success: true, playlist: list })
        //         }
        //         else {
        //             console.log("incorrect user!");
        //             return res.status(400).json({ success: false, description: "authentication error" });
        //         }
        //     });
        // }
        // asyncFindUser(list);
    }).catch(err => console.log(err))
}

getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                // console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            published: list.published,
                            createDate: list.createdAt,
                            editDate: list.updatedAt,
                            publishDate: list.publishDate,
                            listOwner: list.ownerUsername,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            listens: list.listens
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}

getPlaylists = async (req, res) => {
    await Playlist.find({ published: true }, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                published: list.published,
                createDate: list.createdAt,
                editDate: list.updatedAt,
                publishDate: list.publishDate,
                listOwner: list.ownerUsername,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens
            };
            pairs.push(pair);
        }
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err))
}

getAllPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                published: list.published,
                createDate: list.createdAt,
                editDate: list.updatedAt,
                publishDate: list.publishDate,
                listOwner: list.ownerUsername,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens
            };
            pairs.push(pair);
        }
        console.log('RETURNING ALL PAIRS!')
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err))
}

searchCurrentUser = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    let { name, user } = req.query;
    name = name.toLowerCase();
    user = user.toLowerCase();
    await Playlist.find({ name: { "$regex": name, "$options": "i" }, ownerUsername: user }, (err, playlists) => {
        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                published: list.published,
                createDate: list.createdAt,
                editDate: list.updatedAt,
                publishDate: list.publishDate,
                listOwner: list.ownerUsername,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens
            };
            pairs.push(pair);
        }
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err));
}

searchAllPublished = async (req, res) => {
    let name = req.query.name;
    name = name.toLowerCase();
    await Playlist.find({ name: { "$regex": name, "$options": "i" }, published: true }, (err, playlists) => {
        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                published: list.published,
                createDate: list.createdAt,
                editDate: list.updatedAt,
                publishDate: list.publishDate,
                listOwner: list.ownerUsername,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens
            };
            pairs.push(pair);
        }
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err));
}

searchUserPublished = async (req, res) => {
    let user = req.query.user;
    user = user.toLowerCase();
    console.log('Searching for playlists with user substring: ', user)
    await Playlist.find({ ownerUsername: { "$regex": user, "$options": "i" }, published: true }, (err, playlists) => {
        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                published: list.published,
                createDate: list.createdAt,
                editDate: list.updatedAt,
                publishDate: list.publishDate,
                listOwner: list.ownerUsername,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens
            };
            pairs.push(pair);
        }
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err));
}

updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));

    if (!body) {
        // console.log('NO BODY TO UPDATE')
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    if (body.playlist.name.length === 0) {
        return res.status(400).json({
            success: false,
            description: 'All playlists require a name of at least one character.'
        })
    }

    let duplicateFound = false;
    let namedPlaylists = await Playlist.find({ ownerEmail: body.playlist.ownerEmail, name: body.playlist.name});
    if (namedPlaylists.length !== 0) {
        for (let i = 0; i < namedPlaylists.length; i++) {
            if (body.playlist._id != namedPlaylists[i]._id) {
                duplicateFound = true;
            }
        }
    }

    if (duplicateFound) {
        console.log("Can't change list name due to a duplicate...");
        return res.status(400).json({
            success: false,
            description: 'Lists owned by the same user cannot have identical names.'
        })
    }


    let playlist = await Playlist.findById({ _id: req.params.id });
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        })
    }
    console.log(`Playlist ${req.params.id} found...`);

    if (playlist.published) {
        let likes = JSON.stringify(playlist.likes);
        let dislikes = JSON.stringify(playlist.dislikes);
        let comments = JSON.stringify(playlist.comments);
        let listens = JSON.stringify(playlist.listens);
        let newLikes = JSON.stringify(body.playlist.likes);
        let newDislikes = JSON.stringify(body.playlist.dislikes);
        let newComments = JSON.stringify(body.playlist.comments);
        let newListens = JSON.stringify(body.playlist.listens);
        if (likes === newLikes && dislikes === newDislikes && comments === newComments && listens === newListens) {
            return res.status(401).json({
                success: false,
                error: 'The list has already been published.'
            })
        }
    }

    console.log('Can update playlist...');

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
        await User.findOne({ email: list.ownerEmail }, (err, user) => {
            console.log("user._id: " + user._id);
            console.log("req.userId: " + req.userId);
            if (user._id == req.userId) {
                console.log("correct user!");
                console.log("req.body.name: " + req.body.name);

                list.name = body.playlist.name;
                list.songs = body.playlist.songs;
                // Ensures that list is only published at one date
                if (!list.published && body.playlist.published) {
                    list.publishDate = new Date();
                }
                list.published = body.playlist.published;
                list.comments = body.playlist.comments;
                list.likes = body.playlist.likes;
                list.dislikes = body.playlist.dislikes;
                list.listens = body.playlist.listens;
                list
                    .save()
                    .then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            id: playlist._id,
                            playlist: playlist,
                            message: 'Playlist updated!',
                        })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Playlist not updated!',
                        })
                    })
            } else {
                console.log("incorrect user!");
                // Guest has to be able to increment # of listens
                if (playlist.listens !== body.playlist.listens) {
                    playlist.listens = body.playlist.listens;
                    async function updateListens(playlist) {
                        listenedPlaylist = await playlist.save();
                        return res.status(200).json({
                            success: true,
                            id: listenedPlaylist._id,
                            playlist: listenedPlaylist,
                            message: 'Playlist listens updated!',
                        })
                    }

                    updateListens(playlist);
                } else return res.status(400).json({ success: false, description: "authentication error" });
            }
        });
    }
    asyncFindUser(playlist);
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    getAllPlaylists,
    searchCurrentUser,
    searchAllPublished,
    searchUserPublished,
    updatePlaylist
}