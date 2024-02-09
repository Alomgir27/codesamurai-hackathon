const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: {
    type: Number,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});


const StationSchema = new Schema({
  station_id: {
    type: Number,
    required: true
  },
  station_name: {
    type: String,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  }
}); 


const TrainSchema = new Schema({
  train_id: {
    type: Number,
    required: true
  },
  train_name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  stops: [
    {
      station_id: {
        type: Number,
        required: true
      },
      arrival_time: {
        type: String,
        required: false,
        default: null
      },
      departure_time: {
        type: String,
        required: false,
        default: null
      },
      fare: {
        type: Number,
        required: false,
        default: 0
      }
    }
  ]
});



const User = mongoose.model("user", UserSchema);
const Station = mongoose.model("station", StationSchema);
const Train = mongoose.model("train", TrainSchema);


module.exports = {
  User,
  Station,
  Train
};





