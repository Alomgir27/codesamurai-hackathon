const { Station } = require('../models');
const { Train } = require('../models');
const { User } = require('../models');


// const TrainSchema = new Schema({
//     train_id: {
//       type: Number,
//       required: true
//     },
//     train_name: {
//       type: String,
//       required: true
//     },
//     capacity: {
//       type: Number,
//       required: true
//     },
//     stops: [
//       {
//         station_id: {
//           type: Number,
//           required: true
//         },
//         arrival_time: {
//           type: String,
//           required: false,
//           default: null
//         },
//         departure_time: {
//           type: String,
//           required: false,
//           default: null
//         },
//         fare: {
//           type: Number,
//           required: false,
//           default: 0
//         }
//       }
//     ]
//   });
  

//trains
// router.post('/trains', trainsController.addTrain);


// Request Specification
// URL: /api/trains
// Method: POST
// Request model
// {
//  "train_id": integer, # train's numeric id
//  "train_name": string, # train's name
//  "capacity": integer, # seating capacity
//  "stops": [ # list of stops
//  {
//  "station_id": integer, # station's id
//  "arrival_time": string, # arrives at
//  "departure_time" string, # leaves at
//  "fare": integer # ticket cost
//  },
//  ...
//  ]
// }
// Successful Response
// Upon successful operation, your API must return a 201 status code with the saved train object.
// Response status: 201 - Created
// Response model
// {
//  "train_id": integer, # train's numeric id
//  "train_name": string, # train's name
//  "capacity": integer, # seating capacity
//  "service_start": string, # service start time
//  "service_ends": string, # service end time
//  "num_stations": integer # number of stops
// }
// Here, service_start is the start time of the train at the first station, and service_ends is the end time of
// the train at the last station. Time schedule output should follow the same 24-hour time format shown in the
// input model.
// Examples
// Let's look at some example requests and response.
// Example request:
// Request URL: [POST] http://localhost:8000/api/trains
// Content Type: application/json
// Request Body:
// {
//  "train_id": 1,
//  "train_name": "Mahanagar 123",
//  "capacity": 200,
//  "stops": [
//  {
//  "station_id": 1,
//  "arrival_time": null,
//  "departure_time": "07:00",
//  "fare": 0
//  },
//  {
//  "station_id": 3,
//  "arrival_time": "07:45",
//  "departure_time": "07:50",
//  "fare": 20
//  },
//  {
//  "station_id": 4,
//  "arrival_time": "08:30",
//  "departure_time": null,
//  "fare": 30
//  }
//  ]
// }
// Example successful response:
// Content Type: application/json
// HTTP Status Code: 201
// Response Body:
// {
//  "train_id": 1,
//  "train_name": "Mahanagar 123",
//  "capacity": 200,
//  "service_start": "07:00",
//  "service_ends": "08:30",
//  "num_stations": 3
// }