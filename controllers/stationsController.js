const { Station } = require('../models');
const { Train } = require('../models');
const { User } = require('../models');



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
       for (let i = 0; i < trains.length; i++) {
           const train = trains[i];
          for (let j = 0; j < train.stops.length; j++) {
              if (train.stops[j].station_id === parseInt(station_id)) {
                  console.log(train.stops[j]);
                  trainList.push({
                      train_id: train.train_id,
                      arrival_time: train.stops[j].arrival_time,
                      departure_time: train.stops[j].departure_time
                  });
                  break;
              }
           }
          
        }
        res.status(200).json({ station_id, trains: trainList });
       
           
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
    }
};

module.exports = { addStation, listStations, listTrains };