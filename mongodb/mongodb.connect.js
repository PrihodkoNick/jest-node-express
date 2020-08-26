const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://SuperTestUser:super123456@cluster0.nmg2e.mongodb.net/todo-tdd?retryWrites=true&w=majority',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    )  
  } catch (err) {
    console.log('Error connecting to mongodb');
    console.log(err);
  } 
}

module.exports = { connect };