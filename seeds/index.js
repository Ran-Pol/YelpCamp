const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: "purple field" });

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPlaces = sample(places);
        const randomDescriptors = sample(descriptors);

        const newCamp = new Campground({
            author: '62c7c17d0e6f2fc4228c7e21',
            title: `${randomPlaces} ${randomDescriptors}`,
            price: (Math.floor(Math.random() * 50) + 20),
            description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa eius asperiores, quis quod velit non perspiciatis officiis rerum natus veniam molestiae vel neque nisi, consequatur quae ratione accusantium, nobis fuga.`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { coordinates: [cities[random1000].longitude, cities[random1000].latitude], type: 'Point' },
            images: [{
                url: 'https://source.unsplash.com/collection/483251',
                filename: 'La Para'
            }]
        })
        await newCamp.save();
    }

}

seedDB().then(() => {
    db.close();
})

// Campground.find({ price: { $lte: 50 } }).then(results => {
//     console.log(results)
// })