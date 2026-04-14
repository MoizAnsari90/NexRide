const CaptainModel = require('../models/captain.models')


module.exports.createCaptain = async ({ fullname, email, password, vehicle }) => {
    if(!fullname || !email || !password || !vehicle){
        throw new Error('All fields are required');
    }
    const captain = await CaptainModel.create({
        fullname: {
            firstname: fullname.firstname,
            lastName: fullname.lastName,
        },
        email,
        password,
        vehicle: {
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        }
    });
    return captain;
}
