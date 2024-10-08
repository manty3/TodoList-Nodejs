const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const connectDB = async() => {

try {

const conn = await mongoose.connect(process.env.MONGODB_URI)

console.log(`database Connected : ${conn.connection.host }`)
console.log(`Database connection status: ${mongoose.connection.readyState}`);
}catch (error) {
 
console.log(error)
}


}

module.exports =connectDB;