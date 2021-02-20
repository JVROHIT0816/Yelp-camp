const { string } = require('joi');
const mongoose = require('mongoose');
const review = require('./review')
const Schema = mongoose.Schema;

const imageschema = new Schema({
    url: String,
    filename: String
})

imageschema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts =  {toJSON: {virtuals:true}};

const campschema = new Schema({
    title: String,
    image: [imageschema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
},opts);

campschema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/camps/${this._id}">${this.title}</a></strong>`
})

campschema.post('findOneAndDelete', async function(doc){
    if(doc)
    {
        await review.deleteMany({
            _id:{
            $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('camp', campschema);