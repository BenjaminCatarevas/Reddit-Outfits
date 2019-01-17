const promise = require('bluebird');
const configInfo = require('./config');

// pg-promise initialization options;
const initOptions = {
    // bluebird promise library instead of default ES6 Promise;
    promiseLib: promise
}

const pgp = require('pg-promise')(initOptions);

const config = {
    user: configInfo.login.username,
    password: configInfo.login.password,
    host: configInfo.databaseInfo.host,
    port: configInfo.databaseInfo.port,
    database: configInfo.databaseInfo.databaseName
};

const db = pgp(config);

// Query functions
function getUserOutfits(req, res, next) {
    console.log(req.params);
    let author_name = req.params.author_name;
    db.any('SELECT * FROM outfit WHERE author_name = $1', author_name)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: `Retrieved outfits of user ${author_name}`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    getUserOutfits: getUserOutfits
}