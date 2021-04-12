const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
    if (!req.body.login || !req.body.password)
        return res.status(400).json({err: "Paramètre Manquant"});
    
    const check = await User.findOne({login: req.body.login});
    if (check)
        return res.status(403).json({err: "Email Existant"});
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const client = new User({
            login: req.body.login,
            password: hash,
            age: req.body.age,
            famille: req.body.famille,
            race: req.body.race,
            nourriture: req.body.nourriture,
        });
        client.save()
        .then(() => res.status(201).json({client}))
        .catch((err) => res.status(500).json({err}))
    }).catch((err) => res.status(500).json({err}))
}

exports.login = async (req, res, next) => {
    if (!req.body.login || !req.body.password)
        return res.status(400).json({err: "Paramètre Manquant"});
    const check = await User.findOne({login: req.body.login});
    if (!check)
        return res.status(403).json({err: "Aucun Utilisateur Trouvé"});

    const result = await bcrypt.compare(req.body.password, check.password);
    if (!result)
        return res.status(403).json({err: "Mot De Passe Invalide"});
    
    var data = {
        token: jwt.sign(
            {userId: check._id},
            "APPARTOOTESTTOKEN",
            {expiresIn: '24h'}
        )
    };

    return res.status(200).json({data});
}

exports.me = async (req, res, next) => {
    const user = await User.findOne({_id: res.locals.user});

    if (!user) 
        return res.status(400).json({err: "Utilisateur Non Trouvé"});
    return res.status(200).json(user);
}

exports.list = async (req, res, next) => {
    const list = await User.find({}, {password: 0});
    console.log(list)
    return res.status(200).json({list});
}

exports.addFriend = async (req, res, next) => {
    if (!req.body.login)
        return res.status(403).json({err: "Paramètre Manquant"});
    var user = await User.findOne({_id: res.locals.user});
    var friend = await User.findOne({login: req.body.login});

    if (!user || !friend)
        return res.status(403).json({err: "Utilisateur Non Trouvé"});

    user.amis.push(req.body.login);
    friend.amis.push(user.login);
    user.save().catch((err) => res.status(500).json({err}));
    friend.save().catch((err) => res.status(500).json({err}));
    return res.status(200).json("Ok")
}

exports.removeFriend = async (req, res, next) => {
    if (!req.body.login)
        return res.status(403).json({err: "Paramètre Manquant"});
    var user = await User.findOne({_id: res.locals.user});
    var friend = await User.findOne({login: req.body.login});

    if (!user || !friend)
        return res.status(403).json({err: "Utilisateur Non Trouvé"});

    user.amis.splice(user.amis.findIndex(it => {return it === req.body.login}), 1);
    friend.amis.splice(friend.amis.findIndex(it => {return it === user.login}), 1);

    user.save().catch((err) => res.status(500).json({err}));
    friend.save().catch((err) => res.status(500).json({err}));

    return res.status(200).json("Ok")
}

exports.update = async (req, res, next) => {
    User.updateOne({_id: res.locals.user}, {
        $set: {
            age: req.body.age,
            famille: req.body.famille,
            race: req.body.race,
            nourriture: req.body.nourriture,
        }
    }).then(() => {
        res.status(201).json("Ok")
    }).catch(err => res.status(400).json({err}))
}