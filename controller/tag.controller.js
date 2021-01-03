'use strict';

const { TagModel } = require('../models');
const { tagService } = require('../services');
const { handleSuccessOrErrorMessage, currentTimeStamp } = require('../helper/helper');
const { validationResult } = require('express-validator');

module.exports = {
    /* Add new tag */
    addTag: async (req, res) => { 
        try{
            const errors = await validationResult(req); //validation check
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let objData = req.body;
                objData.createdAt = currentTimeStamp();
                objData.updatedAt = currentTimeStamp();
                const result = await tagService.create(objData); //create new tag
                handleSuccessOrErrorMessage(false, "New Tag added", res, result );
                }
        }catch(err){
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },

    /* Get tag data */
    getTag: async (req, res) => {
        try{
            let query = {deletedAt: { $exists: false}}; // query for where deleted date not set
            const result = await tagService.find(query); //get all tag
            handleSuccessOrErrorMessage(false, "All tags data", res, result );
        }catch(err){
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },

    /* Update the tag */
    updateTag: async (req, res) => {
        try{
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let query = {_id: req.params.id}; //query to get data by tag id
                let objData = req.body;
                objData.updatedAt = currentTimeStamp(); // UNIX_TIMESTAMP add
                const result = await tagService.update(query, objData); // update tag data
                handleSuccessOrErrorMessage(false, "Tag updated", res, result );
            }
        }catch(err){
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    },

    /* Set the deleted date for tag */
    deleteTag: async (req, res) => {
        try{
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                let query = {_id: req.params.id}; // query for update Tag Id
                let objData = {};
                objData.deletedAt = currentTimeStamp(); // set UNIX_TIMESTAMP value for deletedAt
                const result = await tagService.update(query, objData); // set deleted date for tag
                handleSuccessOrErrorMessage(false, "Deleted tag data", res, result );
            }
        }catch(err){
            handleSuccessOrErrorMessage(true, `Error occured : ${err}`, res);
        }
    }

}