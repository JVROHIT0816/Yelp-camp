const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
//const { model } = require('mongoose')
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const joi = BaseJoi.extend(extension)
module.exports.campschema = joi.object({
    camp: joi.object({
        title: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        //image: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteimage: joi.array()
})

module.exports.reviewschema = joi.object({
    review: joi.object({
        body: joi.string().required().escapeHTML(),
        rating: joi.number().required().min(1).max(5)
    }).required()
})
