const util = require('util')
const path = require('path');
const Joi = require('joi');
const express = require('express');
const rateLimit = require("express-rate-limit");
const {logger} = require('../../lib/logger');
const {get} = require('../../lib/db');

const limiter = rateLimit({
	windowMs: 60 * 1000, 
	max: 500
});

const NameSchema = Joi.object({
    uuid: Joi.string().required()
});

const router = express.Router();

router.get('/:uuid', limiter, async (reg, res, next) => {
	try {
		const value = await NameSchema.validateAsync(reg.params.Token);

        get.Data(value.uuid).then(result => {
            if(result.rows.length === 0){
                res.status(404);
            }else{
                res.status(200);
                res.send(result.rows[0].text);
            }
        }).catch(err => {
            res.status(500);
        });
	} catch (error) {
    	next(error);
  	}
});

module.exports = router;