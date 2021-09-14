const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err=>{
  console.log(`${err.name}, ${err.message}`)
  process.exit(1)
})

const app = require('./app')

dotenv.config({path: './config.env'})
const DB = process.env.DATABASE

mongoose.connect(DB, {
  useNewUrlParser:true,
  useUnifiedTopology: true
}).then(con =>{ 
  // console.log(con.connections)
  console.log("DB CONNECTED!")
})

// SERVER START ////////////////////////////////////////////////////////////////////
const port = 3000;
const server = app.listen(3000, () => {
  console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', err =>{
  console.log(`${err.name}, ${err.message}`)
  server.close( ()=> {
    process.exit(1);
  })
})
