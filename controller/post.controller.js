'use strict';
const { validationResult } = require('express-validator');
const mongoose = require('mongoose'); 
const { postService, tagService } = require('../services');
const { PostModel } = require('../models');
const { handleSuccessOrErrorMessage, currentTimeStamp } = require('../helper/helper');

module.exports = {
    /* Add new post */
    addPost: async (req, res) => {
        try {
            const errors = await validationResult(req); //validation error 
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let objData = req.body;
                // insert tags data and return tag id
                if (objData.tags !== undefined && objData.tags.length > 0) {
                    await tagService.insert(req.body.tags).then((result) => {
                        objData.tags = result;
                    });
                }
                objData.createdAt = currentTimeStamp();     //add UNIX_TIMESTAMP value
                objData.updatedAt = currentTimeStamp();
                const result = await postService.create(objData);  //create new post
                handleSuccessOrErrorMessage(false, "New post added", res, result);
            }
        } catch (err) {
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },
    /*  Get post data*/
    getPost: async (req, res) => {
        try {
            let sortByArr = ['title', 'date', 'upVote', 'downVote'];
            //check for filter
            if (sortByArr.includes(req.query.sortBy) || req.query.q !== undefined) {
                filter(req, res);  //calling filter method
            } else {
                let query = { deletedAt: { $exists: false } }; //query for post that have no deleted time
                if(req.params.id !== undefined){    
                    query._id = mongoose.Types.ObjectId(req.params.id);       // get result by post Id
                }
                const result = await postService.retrieve(query); //retrive post result
                handleSuccessOrErrorMessage(false, "All post data", res, result);
            }
        } catch (err) {
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },
    /* Update post */
    updatePost: async (req, res) => {
        try {
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let objData = req.body;
                let query = { _id: req.params.id };
                // insert tags data and return tag id
                if (objData.tags !== undefined && objData.tags.length > 0) {
                    await tagService.insert(req.body.tags).then((result) => {
                        objData.tags = result;
                    });
                }
                objData.updateAt = currentTimeStamp();
                const result = await postService.update(query, { $set: objData });
                handleSuccessOrErrorMessage(false, "Post updated", res, result);
            }
        } catch (err) {
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },
    /* Set deleted date for post */
    deletePost: async (req, res) => {
        try {
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let query = { _id: req.params.id };  //query for delete post 
                const objData = {};
                objData.deletedAt = currentTimeStamp(); //set UNIX_TIMESTAMP for deletedAt
                const result = await postService.update(query, { $set: objData }); //call to update Deleted data
                handleSuccessOrErrorMessage(false, "Post deleted", res, result);
            }
        } catch (err) {
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },
    /* Set upVote and downVote for post */
    postVote: async (req, res) => {
        try {
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let isVote = req.body.vote;
                if (isVote === true || isVote === false) {
                    let query = { _id: req.params.id }; // query for find post using id
                    let instance = {};
                    instance.$inc = isVote ? { upVote: 1 } : { downVote: 1 }; // query for increment upVote or downVote
                    instance.$set = { updateAt: currentTimeStamp() };
                    const result = await postService.update(query, instance);
                    handleSuccessOrErrorMessage(false, "Vote to post successfully", res, result);
                } else {
                    handleSuccessOrErrorMessage(false, "Vote value shoud be true or false", res);
                }

            }
        } catch (err) {
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },
}

/* Filter the data according to  query paramter */
async function filter(req, res) {
    try {
        let sortBy = req.query.sortBy;
        let sortByArr = ['title', 'upVote', 'downVote'];       //sort array
        let sortField = sortByArr.includes(sortBy) ? sortBy : 'createdAt'; //variable for sort data
        let sortDirection = req.query.sortOrder === 'ASC' ? 1 : -1; // Sort the data
        let query  = { deletedAt: { $exists: false } };
        let matchQuery;     // Define matchQuery varible
        
        if(req.query.q !== undefined){
            matchQuery={};  // Define  matchQuery varible as object
            let qMatch = req.query.q.split(' ');    // Split q parameter to array
            let tagArr = [];
            qMatch.forEach(tag => {
                tagArr.push({ "tags.name": { $regex: tag, $options: 'i'}})      //add each tage query in array
            }); 
            matchQuery.$or = tagArr;        // Put array of tag in OR condtion for matchQuery
        }else{
            matchQuery = null;
        }
        
        const result = await postService.retrieve(query,sortField, sortDirection, matchQuery); //retrive data according to filter
        handleSuccessOrErrorMessage(false, "Filter result", res, result, sortDirection);
    } catch (err) {
        handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
    }
}