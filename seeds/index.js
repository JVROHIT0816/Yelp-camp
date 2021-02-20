const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities');
const mongo = require('mongoose')
const campground = require('../models/campground');
mongo.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongo.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];



const seed = async() => {
    await campground.deleteMany({});
    for(var i=0;i<300;i++)
    {
        
        const rand = Math.floor(Math.random() * 1000);
        const rando = Math.floor(Math.random()*20) + 10;
        var camp = new campground({
            author: '600be90cf2c43a1e3885ed2b',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dris3a379/image/upload/v1611757456/YelpCamp/hzsxdvtj2pl0aiczho53.jpg',
                  filename: 'YelpCamp/hzsxdvtj2pl0aiczho53'
                }
              ],
            geometry: {
                type: 'Point',
                coordinates: [cities[rand].longitude,cities[rand].latitude]
            },
            description: 'TBD',
            price: rando
        })
        await camp.save();
    }

}

seed().then(() => {
    mongo.connection.close();
});