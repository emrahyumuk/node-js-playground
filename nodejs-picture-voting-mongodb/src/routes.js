var db = require('./database'),
    photo = db.photo,
    user = db.user;

module.exports = function (app) {
    app.get('/', function (req, res) {
        photo.find({}, function (err, allPhotos) {
            user.find({ip: req.ip}, function (err, u) {
                var votedOn = [];

                if (u.length == 1) {
                    votedOn = u[0].votes;
                }

                var notVotedOn = allPhotos.filter(function (p) {
                    return votedOn.indexOf(p._id) == -1;
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
        photo.find({}, function (err, allPhotos) {
            allPhotos.sort(function (p1, p2) {
                return (p2.likes - p2.dislikes) - (p1.likes - p1.dislikes);
            });
            res.render('photoList', {photoList: allPhotos});
        });
    });

    app.post('*', function (req, res, next) {
        var u = new user({
            ip: req.ip,
            votes: []
        });
        u.save(function (err) {
            next();
        });
    });

    app.post('/notcute', vote);

    app.post('/cute', vote);

    function vote(req, res) {
        photo.findOne({name: req.body.photo}, function (err, p) {
            if (p != null) {
                if (req.path == '/cute') {
                    p.likes++;
                } else if (req.path == '/notcute') {
                    p.dislikes++;
                }

                photo.update({name: p.name},
                    {$set: {
                        dislikes: p.dislikes,
                        likes: p.likes
                    }}).exec();

                user.update({ip: req.ip}, {$addToSet: {votes: p._id}}, function () {
                    res.redirect('../');
                });
            } else {
                res.redirect('../');
            }
        });
    }


};


