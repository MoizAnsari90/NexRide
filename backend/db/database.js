const mongoose = require('mongoose');

function connectToDb(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connect to DB');
    })
    .catch(err => console.log(err));
}

module.exports = connectToDb;