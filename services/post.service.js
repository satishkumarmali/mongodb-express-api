'use strict';

const { PostModel } = require('../models');

const self = module.exports = {
    /* create new post */
    create: async (objData) => {
        return await PostModel.create(objData);
    },

    find: async (query = {}, extraOptions = {}) => {
        return await PostModel.find(query, extraOptions);
    },

    findOne: async (query = {}, extraOptions = {}) => {
        return await PostModel.findOne(query);
    },

    update: async (query = {}, instance = {}) => {
        await PostModel.updateOne(query, instance);
        return await PostModel.findOne(query);
    },

    remove: async (query) => {
        return await PostModel.deleteOne(query);
    },

    filter: async (sortField, sortDirection, extraOptions = {}) => {
        let query = { deletedAt: { $exists: false } };
        let option = { sort: (sortDirection === 'ASC' ? '' : '-') + sortField };
        return await PostModel.find(query, extraOptions, option);
    },

    retrieve: async (query = { }, sortField = null, sortDirection = null, matchQuery = null) => {
        //Fetch result from two tables
        let pipeline = [
            {
                $match: query
            },
            {
                $unwind: {          //Deconstructs an array field
                    path: "$tags",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $lookup: {              //Get data from another table
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $unwind: {
                    path: "$tags",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $group: {               //Group all data by post
                    _id: "$_id",
                    tags: {$push: "$tags"},
                    upVote: {$first: "$upVote"},
                    downVote: {$first: "$downVote"},
                    title: {$first: "$title"},
                    body: {$first: "$body"},
                    createdAt: {$first: "$createdAt"},
                    updatedAt: {$first: "$updatedAt"}
                }
            },
            {
                $project: {          //Include field for output    
                    _id: "$_id",
                    tags: "$tags",
                    upVote: "$upVote",
                    downVote: "$downVote",
                    title: "$title",
                    titleSort: {$toLower : "$title"},
                    body: "$body",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt"
                }
            }
        ];
        //match result
        if(matchQuery !== null){
            let obj = {$match: matchQuery};
            pipeline.push(obj);
        } 
        //Sort Result
        if(sortField !== null){
            let obj = {}
            sortField = (sortField == 'title') ? 'titleSort' : sortField; //sorting for case insensitive
            obj[sortField]=(sortDirection !== null ? sortDirection :-1);
            let qry = {$sort: obj};
            pipeline.push(qry);
        }

        return await PostModel.aggregate(pipeline);
    }
}