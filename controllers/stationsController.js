const { Station } = require('../models');
const { Train } = require('../models');
const { User } = require('../models');

// Request Specification
// URL: /api/stations
// Method: POST
// Request model

// {
// "station_id": integer, # station's numeric id
// "station_name": string, # station's name
// "longitude": float, # coordinate longitude
// "latitude": float # coordinate latitude
// }

// Successful Response
// Upon successful operation, your API must return a 201 status code with the saved station object.
// Response status: 201 - Created
// Response model

// {
// "station_id": integer, # station's numeric id
// "station_name": string, # station's name
// "longitude": float, # coordinate longitude
// "latitude": float # coordinate latitude
// }

// Examples
// Let's look at some example requests and response.
// Example request:
// Request URL: [POST] http://localhost:8000/api/stations
// Content Type: application/json
// Request Body:

// {
// "station_id": 1,
// "station_name": "Dhaka GPO",
// "longitude": 90.399452,
// "latitude": 23.777176
// }

// Example successful response:
// Content Type: application/json
// HTTP Status Code: 201

// Response Body:

// {
// "station_id": 1,
// "station_name": "Dhaka GPO",
// "longitude": 90.399452,
// "latitude": 23.777176
// }
//stations
// router.post('/stations', stationsController.addStation);
// router.get('/stations', stationsController.listStations);
// router.get('/stations/:station_id/trains', stationsController.listTrains);

//@ROUTE - /api/stations
//@DESC - Add a station
//@METHOD - POST
const addStation = async (req, res) => {
  const { station_id, station_name, longitude, latitude } = req.body;
  try {
    const station = new Station({ station_id, station_name, longitude, latitude });
    await station.save();
    res.status(201).json({ station_id, station_name, longitude, latitude });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
};

// Station
// List All Stations
// List down all stations in the ascending order of their IDs.
// Request Specification
// URL: /api/stations
// Method: GET
// Request model: None
// Successful Response
// Upon successful operation, your API must return a 200 status code with the list of all station objects. The
// output should contain an empty list if there are no stations in the system.
// Response status: 200 - Ok
// Response model

// {
// "stations": [
// {
// "station_id": integer, # station's numeric id
// "station_name": string, # station's name
// "longitude": float, # coordinate longitude
// "latitude": float # coordinate latitude
// },
// ...
// ]
// }

// If there are no stations, the response will look like the following:

// {
// "stations": []
// }

// This is still considered a successful response.
// Failed Response
// For this endpoint, you do not have to handle failure responses.
// Examples
// Let's look at some example requests and responses.
// Example request:
// Request URL: [GET] http://localhost:8000/api/stations
// Example successful response:
// Content Type: application/json
// HTTP Status Code: 200
// Response Body:

// {
// "stations": [
// {
// "station_id": 1,
// "station_name": "Dhaka GPO",
// "longitude": 90.399452,
// "latitude": 23.777176
// },
// {
// "station_id": 2,
// "station_name": "Motijheel",
// "longitude": 90.417458,
// "latitude": 23.733330
// },
// {
// "station_id": 3,
// "station_name": "Rajarbagh",
// "longitude": 90.4166667,
// "latitude": 23.7333333
// }
// ]
// }

//@ROUTE - /api/stations
//@DESC - List all stations
//@METHOD - GET
const listStations = async (req, res) => {
  try {
    const stations = await Station.find().sort({ station_id: 1 });
      let stationList = [];
        stations.forEach(station => {
            stationList.push({
            station_id: station.station_id,
            station_name: station.station_name,
            longitude: station.longitude,
            latitude: station.latitude
            });
        });
    res.status(200).json({ stations: stationList });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
};



// List All Train

// List down all trains that have a stop at a given station. Sort them in the ascending order of departure time. If
// trains have the exact departure time, sort them according to their arrival time in ascending order. In sorting
// order, null values should appear before a time value for the respective fields.
// If a tie between entries still exists, sort them based on their train_ids ascending order.
// Request Specification
// URL: /api/stations/{station_id}/trains # station_id will be part of the path parameter.
// Method: GET
// Request model: None
// Successful Response
// Upon successful operation, your API must return a 200 status code with the list of all station objects.
// Response status: 200 - Ok
// Response model

// {
// "station_id": integer, # the station's id
// "trains": [
// {
// "train_id": integer, # train's id
// "arrival_time": string, # arrives at
// "departure_time": string # leaves at
// },
// ...
// ]
// }

// If no train passes through the station in question, the response will look like the following:

// {
// "station_id": integer, # the station's id
// "trains": []
// }

// This is still considered a successful response.
// Failed Response
// If a station does not exist with the given ID, your API must return a 404 status code with a message.
// Response status: 404 - Not Found

// Response model

// {
// "message": "station with id: {station_id} was not found"
// }

// Replace {station_id} with the station ID from request.
// Examples
// Let's look at some example requests and responses.
// Example request:
// Request URL: [GET] http://localhost:8000/api/stations/1/trains
// Example successful response:
// Content Type: application/json
// HTTP Status Code: 200
// Response Body:

// {
// "station_id": 1,
// "trains": [
// {
// "train_id": 1,
// "arrival_time": null,
// "departure_time": "07:00"
// },
// {
// "train_id": 2,
// "arrival_time": "06:55",
// "departure_time": "07:00"
// },
// {
// "train_id": 3,
// "arrival_time": "07:30",
// "departure_time": "08:00"
// }
// ]
// }


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

//@ROUTE - /api/stations/:station_id/trains
//@DESC - List all trains
//@METHOD - GET
const listTrains = async (req, res) => {
    const station_id = req.params.station_id;
    try {
        const station = await Station.findOne({ station_id: station_id });
        if (!station) {
            return res.status(404).json({ message: `station with id: ${station_id} was not found` });
        }
        const trains = await Train.find({ "stops.station_id": station_id }).sort({ "stops.departure_time": 1, "stops.arrival_time": 1, train_id: 1 });
        let trainList = [];
        trains.forEach(train => {
            const stop = train.stops.find(stop => stop.station_id === station_id);
            trainList.push({
                train_id: train.train_id,
                arrival_time: stop.arrival_time,
                departure_time: stop.departure_time
            });
        });
        res.status(200).json({ station_id, trains: trainList });
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
    }
};

module.exports = { addStation, listStations, listTrains };