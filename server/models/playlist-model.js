const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        ownerUsername: { type: String, required: true},
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        published: { type: Boolean, default: false },
        publishDate: { type: Date, default: null },
        comments: { type: [{ 
            username: String, 
            comment: String
        }], default: []},  
        likes: { type: [String], default: [] },
        dislikes: { type: [String], default: [] },
        listens: { type: Number, default: 0 }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
