const util = require('util')
const path = require('path');
const Joi = require('joi');
const express = require('express');
const rateLimit = require("express-rate-limit");
const {escape} = require('html-escaper');
const { logger } = require('../../lib/logger');
const db = require('../../lib/db');

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
        const RequestData = {
            uuid: reg.params.uuid
        }
        const value = await NameSchema.validateAsync(RequestData);

        db.get.Data(value.uuid).then(result => {
            if (result.rows.length === 0) {
                res.status(404);
                res.send(`No data found for uuid: ${value.uuid}`);
            } else {
                res.status(200);
                //res.send(`<text>${result.rows[0].text_data}</text>`);
                res.send(`<pre style="word-wrap: break-word; white-space: pre-wrap;">${escape(result.rows[0].text_data)}</pre>`)
            }
        }).catch(err => {
            res.status(500);
        });
    } catch (error) {
        logger('error', 'Error: ' + error);
        next(error);
    }
});

module.exports = router;