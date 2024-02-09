const { User } = require('../models');
const { Station } = require('../models');
const { Train } = require('../models');


// const UserSchema = new Schema({
//   user_id: {
//     type: Number,
//     required: true
//   },
//   user_name: {
//     type: String,
//     required: true
//   },
//   balance: {
//     type: Number,
//     required: true
//   }
// });


// const StationSchema = new Schema({
//   station_id: {
//     type: Number,
//     required: true
//   },
//   station_name: {
//     type: String,
//     required: true
//   },
//   longitude: {
//     type: Number,
//     required: true
//   },
//   latitude: {
//     type: Number,
//     required: true
//   }
// }); 


// const TrainSchema = new Schema({
//   train_id: {
//     type: Number,
//     required: true
//   },
//   train_name: {
//     type: String,
//     required: true
//   },
//   capacity: {
//     type: Number,
//     required: true
//   },
//   stops: [
//     {
//       station_id: {
//         type: Number,
//         required: true
//       },
//       arrival_time: {
//         type: String,
//         required: false,
//         default: null
//       },
//       departure_time: {
//         type: String,
//         required: false,
//         default: null
//       },
//       fare: {
//         type: Number,
//         required: false,
//         default: 0
//       }
//     }
//   ]
// });




// Request Specification
// URL: /api/users
// Method: POST
// Request model:

// {
// "user_id": integer, # user's numeric id
// "user_name": string, # user's full name
// "balance": integer # user's wallet balance
// }

// Successful Response
// Upon successful operation, your API must return a 201 status code with the saved user object.
// Response status: 201 - Created
// Response model:

// {
// "user_id": integer, # user's numeric id
// "user_name": string, # user's full name
// "balance": integer # user's wallet balance
// }

// Examples
// Let's look at some example requests and responses.
// Example request:

// Request URL: [POST] http://localhost:8000/api/users
// Content Type: application/json
// Request Body:

// {
// "user_id": 1,
// "user_name": "Fahim",
// "balance": 100
// }

// Example successful response:
// Content Type: application/json
// HTTP Status Code: 201
// Response Body:

// {
// "user_id": 1,
// "user_name": "Fahim",
// "balance": 100
// }

//@ROUTE - /api/users
//@DESC - Add a user
//@METHOD - POST
const addUser = async (req, res) => {
  const { user_id, user_name, balance } = req.body;
  try {
    const user = new User({ user_id, user_name, balance });
    await user.save();
    res.status(201).json({ user_id, user_name, balance });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
};


// Request Specification
// URL: /api/routes?from={station_from}&to={station_to}&optimize={cost|time}
// Method: GET
// Request model: None
// Here, station_from and station_to are station IDs, and optimize will be either cost or time.
// Successful Response
// Upon successful operation, your API must return a 200 status code with total time, total cost, and a list of all
// stations in order of visits. You should also include each station's train ID and arrival and departure schedules in
// the output object. Departure time should follow the same time format as in the input model. For the first
// station, the arrival time should be null,; for the last station, the departure time should be null.
// Response status: 201 - Created
// Response model
// {
//  "total_cost": int, # total cost
//  "total_time": int, # total time in minutes
//  "stations": [
//  {
//  "station_id": integer, # station's numeric id
//  "train_id": integer, # train's id user is riding
//  "arrival_time": string, # arrival time
//  "departure_time": string # departure time
//  },
//  ...
//  ]
// }
// Failed Response
// Unreachable station
// If it is not possible to reach the destination station from the starting station, output a message with HTTP 403 -
// Forbidden and a message for the user.
// Response status: 403 - Forbidden
// Response model
// {
//  "message": "no routes available from station: {station_from} to station:
// {station_to}"
// }
// Replace {station_from} and {station_to} as specified in the input model.
// Examples
// Let's look at some example requests and response.
// Example request:
// Request URL: [PUT] http://localhost:8000/api/routes?from=1&to=5&optimize=cost
// Example successful response:
// Content Type: application/json
// HTTP Status Code: 201
// Response Body:
// {
//  "total_cost": 101,
//  "total_time": 85,
//  "stations": [
//  {
//  "station_id": 1,
//  "train_id": 3,
//  "departure_time": "11:00",
//  "arrival_time": null,
//  },
//  {
//  "station_id": 3,
//  "train_id": 2,
//  "departure_time": "12:00",
//  "arrival_time": "11:55"
//  },
//  {
//  "station_id": 5,
//  "train_id": null,
//  "departure_time": null,
//  "arrival_time": "12:25"
//  }
//  ]
// }
// Example request for no tickets:
// Request URL: [PUT] http://localhost:8000/api/tickets
// Content Type: application/json
// Request Body:
// {
//  "wallet_id": 3,
//  "time_after": "10:55",
//  "station_from": 1,
//  "station_to": 5
// }
// Example failed response:
// Content Type: application/json
// HTTP Status Code: 403
// Response Body:
// {
//  "message": "no routes available from station: 1 to station: 5"
// }



const getRouteByCost = async (stations, trains, from, to) => {
    //use dijkstra's algorithm to find the shortest path
    //optime can be cost or time 
    //from and to is station id
    //stations is an array of all stations
    //trains is an array of all trains
    let graph = {};
    for (let i = 0; i < stations.length; i++) {
        graph[stations[i].station_id] = [];
    }
    for (let i = 0; i < trains.length; i++) {
        for (let j = 0; j < trains[i].stops.length - 1; j++) {
            let from = trains[i].stops[j];
            let to = trains[i].stops[j + 1];
            let cost = to.fare;
            //here time is equall to null or hh:mm
            graph[from.station_id].push({ to: to.station_id, cost, time: to.arrival_time, train_id: trains[i].train_id });
        }
    }
    let visited = {};
    let previous = {};
    //declare distance as an Set of pair cost and time
    let distance = {};
    for (let i = 0; i < stations.length; i++) {
        //in distance keep a pair cost and time
        distance[stations[i].station_id] = { cost: Infinity, time: Infinity };
        previous[stations[i].station_id] = null;
    }

    distance[from] = { cost: 0, time: 0 };
    while (true) {
        let min = Infinity;
        let u = null;
        for (let i = 0; i < stations.length; i++) {
            if (!visited[stations[i].station_id] && distance[stations[i].station_id].cost < min) {
                min = distance[stations[i].station_id].cost;
                u = stations[i].station_id;
            }
        }
        if (u === null) {
            break;
        }
        visited[u] = true;
        for (let i = 0; i < graph[u].length; i++) {
            let v = graph[u][i].to;
            let cost = graph[u][i].cost;
            let time = graph[u][i].time;
            if (distance[u].cost + cost < distance[v].cost) {
                distance[v].cost = distance[u].cost + cost;
                distance[v].time = distance[u].time + time;
                previous[v] = u;
            }
        }
    }
    let path = [];
    let end = to;
    while (end !== null) {
        path.push(end);
        end = previous[end];
    }
    path.reverse();
    let stationsInOrder = [];
    let ke
    for (let i = 0; i < path.length; i++) {
        let station = stations.find(station => station.station_id === path[i]);
        let train = null;
        if (i < path.length - 1) {
            train = trains.find(train => train.stops.some(stop => stop.station_id === path[i] && stop.departure_time !== null));
        }
        stationsInOrder.push({ station_id: station.station_id, train_id: train?.train_id, arrival_time: i === 0 ? null : train?.stops.find(stop => stop.station_id === path[i - 1]).arrival_time, departure_time: i === path.length - 1 ? null : train?.stops.find(stop => stop.station_id === path[i]).departure_time });
    }
    return { cost: distance[to].cost, time: distance[to].time, stations: stationsInOrder };
}


    
   



//@ROUTE - /api/routes?from={station_from}&to={station_to}&optimize={cost|time}
//@DESC - Get route
//@METHOD - GET
const getOptimalRoute = async (req, res) => {
    const { from, to, optimize } = req.query;
    try {
        const stations = await Station.find({});
        const trains = await Train.find({});
        const route = await getRoute(stations, trains, from, to, optimize);
        if (route.message) {
            return res.status(route.status).json({ message: route.message });
        }
        res.status(200).json({ total_cost: route.cost, total_time: route.time, stations: route.stations });
    } catch (error) {
        res.status(400).json({ error: error?.message });
    }
}

















// Example request for no tickets:
// Request URL: [PUT] http://localhost:8000/api/tickets
// Content Type: application/json
// Request Body:

// {
// "wallet_id": 3,
// "time_after": "10:55",
// "station_from": 1,
// "station_to": 5
// }

// Example failed response:
// Content Type: application/json
// HTTP Status Code: 403
// Response Body:

// {
// "message": "no routes available from station: 1 to station: 5"
// }


// Request Specification
// URL: /api/tickets
// Method: POST
// Request model:

// {
// "wallet_id": int, # user's wallet id (same as user id)
// "time_after": string, # time (24 hours hh:mm) after which user
// wants to purchase a ticket
// "station_from": int, # station_id for the starting station
// "station_to": int # station_id for the destination station
// }

// Successful Response
// Upon successful operation, your API must return a 201 status code with the generated ticket ID, remaining
// balance, wallet ID, and a list of all stations in order of visits. You should also include each station's train ID and
// arrival and departure schedules in the output object. Departure time should follow the same time format as in
// the input model. For the first station, the arrival time should be null, and for the last station, the departure
// time should be null.
// Response status: 201 - Created
// Response model

// {
// "ticket_id": int, # generate a unique integer ticket
// ID
// "wallet_id": int, # user's wallet id (same as user
// id)
// "balance": integer, # remaining balance
// "stations": [
// {
// "station_id": integer, # station's numeric id

// "train_id": integer, # train's id user is riding
// "arrival_time": string, # arrival time
// "departure_time": string # departure time
// },
// ...
// ]
// }

// Failed Response
// Insufficient balance
// If the wallet has insufficient balance for purchasing the ticket, respond with HTTP 402 - Payment Required and
// a message showing the shortage amount.
// Response status: 402 - Payment Required
// Response model

// {
// "message": "recharge amount: {shortage_amount} to purchase the thicket"
// }

// Replace {shortage_amount} with the amount the user is short of the ticket's cost.

// Note: This amount may vary depending on whether you can find an optimal-cost route for the user. Sub-
// optimal solutions may be awarded with partial scores.

// Unreachable station
// If it is impossible to reach the destination station from the starting station, output a message with HTTP 403 -
// Forbidden and a message for the user.
// Response status: 403 - Forbidden
// Response model

// {
// "message": "no ticket available for station: {station_from} to station:
// {station_to}"
// }

// Replace {station_from} and {station_to} as specified in the input model.
// Examples

// Let's look at some example requests and responses.
// Example request:
// Request URL: [PUT] http://localhost:8000/api/tickets
// Content Type: application/json
// Request Body:

// {
// "wallet_id": 3,
// "time_after": "10:55",
// "station_from": 1,
// "station_to": 5
// }

// Example successful response:
// Content Type: application/json
// HTTP Status Code: 201
// Response Body:

// {
// "ticket_id": 101,
// "balance": 43,
// "wallet_id": 3,
// "stations": [
// {
// "station_id": 1,
// "train_id": 3,
// "departure_time": "11:00",
// "arrival_time": null,
// },
// {
// "station_id": 3,
// "train_id": 2,
// "departure_time": "12:00",
// "arrival_time": "11:55"
// },
// {
// "station_id": 5,
// "train_id": 2,
// "departure_time": null,
// "arrival_time": "12:25"
// }

// ]
// }

// Example request for no tickets:
// Request URL: [PUT] http://localhost:8000/api/tickets
// Content Type: application/json
// Request Body:

// {
// "wallet_id": 3,
// "time_after": "10:55",
// "station_from": 1,
// "station_to": 5
// }

// Example failed response:
// Content Type: application/json
// HTTP Status Code: 403
// Response Body:

// {
// "message": "no ticket available for station: 1 to station: 5"
// }

// Example request for insufficient funds:
// Request URL: [PUT] http://localhost:8000/api/tickets
// Content Type: application/json
// Request Body:

// {
// "wallet_id": 3,
// "time_after": "10:55",
// "station_from": 1,
// "station_to": 5
// }

// Example failed response:

// Content Type: application/json
// HTTP Status Code: 402
// Response Body:

// {
// "message": "recharge amount: 113 to purchase the ticket"
// }


// Users can use their wallet balance to purchase tickets from stations A to B. The cost is calculated as the sum of
// the fares for each pair of consecutive stations along the route. Upon successful purchase, your API should
// respond with the station in order visited by one or more trains and the remaining wallet balance. If the wallet
// does not have sufficient funds, respond with an error specifying the shortage amount. If it is impossible to
// reach station B from station A within the day or due to a lack of trains, respond with an error specifying that no
// tickets are available.
// Note: The user may want to change the train at a particular station for a cheaper trip. Partial scoring will be
// awarded if your API fails to find an optimal route. You can assume that the start and destination stations will
// always differ, and the user must complete the trip within the current day.

    
    


//@ROUTE - /api/tickets
//@DESC - Purchase a ticket
//@METHOD - POST
const purchaseTicket = async (req, res) => {
  const { wallet_id, time_after, station_from, station_to } = req.body;
  try {
    const user = await User.findOne({ user_id: wallet_id });
    if (!user) {
      return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` });
    }
    const stations = await Station.find({});
        const trains = await Train.find({});
        const ticket = await getTicket(user, stations, trains, time_after, station_from, station_to);
        if (ticket.message) {
          return res.status(ticket.status).json({ message: ticket.message });
        }
        user.balance -= ticket.cost;
        await user.save();
        res.status(201).json({ ticket_id: ticket.id, wallet_id, balance: user.balance, stations: ticket.stations });
    }
    catch (error) {
      res.status(400).json({ error: error?.message });
    }
}
    
 

module.exports = {
    addUser,
    getOptimalRoute,
    purchaseTicket
};