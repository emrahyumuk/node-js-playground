var mongoose = require('mongoose'),
	fs = require('fs');

mongoose.connect('mongodb://testUser:testPassword@ds033429.mongolab.com:33429/photo-voting');

var photoSchema = new mongoose.Schema({
    name: String,
    likes: { type: Number },
    dislikes: { type: Number }
});

var userSchema = new mongoose.Schema({
    ip: {type: String, index: {unique: true, dropDups: true}},
    votes: []
});

var photo = mongoose.model('Photo', photoSchema);
var user = mongoose.model('User', userSchema);

photo.remove().exec();
user.remove().exec();

var photosOnDisk = fs.readdirSync(__dirname + '/public/photos');

photosOnDisk.forEach(function (pName) {
    var p = new photo({
        name: pName,
        likes: 0,
        dislikes: 0
    });
    p.save();
});

module.exports = {
    photo: photo,
    user: user
};



