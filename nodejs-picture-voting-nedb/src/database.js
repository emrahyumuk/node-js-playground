var dataStore = require('nedb'),
    fs = require('fs');

var photos = new dataStore({filename: __dirname + '/data/photos', autoload: true}),
    users = new dataStore({filename: __dirname + '/data/users', autoload: true});

photos.ensureIndex({fieldName: 'name', unique: true});
users.ensureIndex({fieldName: 'ip', unique: true});

var photosOnDisk = fs.readdirSync(__dirname + '/public/photos');

photosOnDisk.forEach(function (photo) {
    photos.insert({
        name: photo,
        likes: 0,
        dislikes: 0
    });
});

module.exports = {
    photos: photos,
    users: users
};



