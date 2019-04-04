var db = require('./database'),
    photos = db.photos,
    users = db.users;

module.exports = function (app) {
    app.get('/', function (req, res) {
        photos.find({}, function (err, allPhotos) {
            users.find({ip: req.ip}, function (err, u) {
                var votedOn = [];

                if (u.length == 1) {
                    votedOn = u[0].votes;
                }

                var notVotedOn = allPhotos.filter(function (photo) {
                    return votedOn.indexOf(photo._id) == -1;
                });

                var imageToShow = null;

                if (notVotedOn.length > 0) {
                    imageToShow = notVotedOn[Math.floor(Math.random() * notVotedOn.length)];
                }

                res.render('home', {photo: imageToShow});
            });
        });
    });

    app.get('/photoList', function (req, res) {
        photos.find({}, function (err, allPhotos) {
            allPhotos.sort(function (p1, p2) {
                return (p2.likes - p2.dislikes) - (p1.likes - p1.dislikes);
            });
            res.render('photoList', {photoList: allPhotos});
        });
    });

    app.post('*', function (req, res, next) {
        users.insert({
            ip: req.ip,
            votes: []
        }, function () {
            next();
        });
    });

    app.post('/notcute', vote);

    app.post('/cute', vote);

    function vote(req, res) {
        photos.findOne({name: req.body.photo}, function (err, photo) {
            if (photo != null) {
                if (req.path == '/cute') {
                    photo.likes++;
                } else if (req.path == '/notcute') {
                    photo.dislikes++;
                }

                photos.update({name: photo.name},
                    {$set: {
                        dislikes: photo.dislikes,
                        likes: photo.likes
                    }});

                users.update({ip: req.ip}, {$addToSet: {votes: photo._id}}, function () {
                    res.redirect('../');
                });
            } else {
                res.redirect('../');
            }
        });
    }


};


