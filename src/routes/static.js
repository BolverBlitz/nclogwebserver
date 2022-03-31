const util = require("util");
const path = require("path");
const fs = require("fs");
const Joi = require("joi");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { logger } = require("../../lib/logger");


const dir = "./static_store";
let static_store_array = [];
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
fs.readdir("./static_store", function (err, filenames) {
    for (let i = 0; i < filenames.length; i++) {
        if (filenames[i].endsWith(".txt")) {
            static_store_array.push(filenames[i].substring(0, filenames[i].length - 4));
        }
    }
});

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 500
});

const NameSchema = Joi.object({
    uuid: Joi.string().required().regex(/^[a-zA-Z0-9-]*$/i)
});

const router = express.Router();

router.get("/", limiter, async (reg, res, next) => {
    try {
        if (process.env.Enable_Static_List === "true" || process.env.Enable_Static_List === true) {
            res.status(200);
            res.send(static_store_array);
        } else {
            res.status(403);
            res.send("Static list disabled");
        }
    } catch (error) {
        logger("error", "Error: " + error);
        next(error);
    }
});

router.get("/:uuid", limiter, async (reg, res, next) => {
    try {
        const RequestData = {
            uuid: reg.params.uuid
        }
        const value = await NameSchema.validateAsync(RequestData);

        if (!static_store_array.includes(value.uuid)) {
            res.status(404);
            res.send(`No data found for uuid: ${value.uuid}`);
        } else {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send(`${fs.readFileSync(path.join(dir, value.uuid + ".txt"), "utf8")}`)
        }
    } catch (error) {
        logger("error", "Error: " + error);
        next(error);
    }
});

module.exports = router;