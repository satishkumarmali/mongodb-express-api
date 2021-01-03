const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
        title: {
            type: String
        },
        body: {
            type: String
        },
        tags: [],
        upVote: {
            type: Number,
            default: 0
        },
        downVote: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        },
        deletedAt: {
            type: String
        }
    }
);

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
