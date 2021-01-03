const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TagSchema = new Schema({
        name: {
            type: String
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

const Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;
