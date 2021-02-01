const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

const places = {
  "Alice's House": {x: 296, y: 87},     // -> 0
  "Bob's House": {x: 336, y: 190},      // -> 1
  "Cabin": {x: 381, y: 51},             // -> 2
  "Daria's House": {x: 168, y: 277},    // -> 3
  "Ernie's House": {x: 72, y: 278},     // -> 4
  "Farm": {x: 56, y: 102},              // -> 5
  "Grete's House": {x: 56, y: 184},     // -> 6
  "Marketplace": {x: 181, y: 89},      // -> 7
  "Post Office": {x: 224, y:55},        // -> 8 
  "Shop": {x: 121, y: 197},          // -> 9
  "Town Hall": {x: 224, y: 200},         // -> 10
}

// document.addEventListener("keypress", (e) => {
//   if (e.code == "KeyP") isActive = !isActive
// })

const roadGraph = createRoadGraph(roads);
const placeNames = Object.keys(places)
let route = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

function randomParcels(n = 4) {
  let parcels = [];
  for (let i = 0; i < n; i++) {
    let from = placeNames[Math.floor(Math.random() * 11)]
    let to = placeNames[Math.floor(Math.random() * 11)];
    while (from == to) { 
      to = placeNames[Math.floor(Math.random() * 11)];
    }
    parcels.push({ place: from, address: to})
  }
  return parcels
}

function randomaTron(memory, villageState) {
  let randomNum = Math.floor(Math.random() * roadGraph[villageState.place].length)
  let randomDirection = roadGraph[villageState.place][randomNum]
  // console.log(randomDirection)
  return { direction: randomDirection, memory: [] }
}

function goalOrientedRobot(memory, villageState) {
  if (memory.length == 0) {
    let parcel = villageState.parcels[0]
    if (parcel.place == villageState.place) {
      memory = findPath(roadGraph, parcel.place, parcel.address)
    } else {
      memory = findPath(roadGraph, villageState.place, parcel.place)
    }
  }
  return { direction: memory[0], memory: memory.slice(1) }
}
// function goalOrientedRobot(memory, villageState, route = []) {
//   if (route.length == 0) {
//     let parcel = villageState.parcels[0]
//     if (parcel.place == villageState.place) {
//       route = findPath(roadGraph, parcel.place, parcel.address)
//     } else {
//       route = findPath(roadGraph, villageState.place, parcel.place)
//     }
//   }
//   return { direction: route[0], memory: route.slice(1) }
// }

function findPath(graph, from, to) {
  let work = [{ at: from, route: [] }]
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i]
    for (let place of graph[at]) {
      if (place == to) {
        return route.concat(place)
      } 
      if (!work.some(w => w.at == place)) {
        work.push({ at: place, route: route.concat(place)})
      }
    }
  }
}

function routeRobot(memory, state) {
  // console.log(memory)
  if (memory.length === 0) {
    console.log(memory)
    memory = route
  }
  return { direction: memory[0], memory: memory.slice(1) }
}

let robotState = []
function runRobot(state, robot) {
  console.log(robot.toString())
  for (let i = 0; ; i++) {
    let { direction, memory } = robot(robotState)
    robotState = memory
    if (state.parcels.length == 0) {
      console.log(`Done in ${i} turns`)
      return i
    }
    state = state.move(direction)
  }
}
// console.log(runRobot(new VillageState("Post Office", randomParcels(2)), routeRobot))

// function compareRobots(robot1, robot2) {
//   let startState = new VillageState("Post Office", randomParcels(5))
//   let villageState1 = JSON.parse(JSON.stringify(startState))
//   let firstRobot = runRobot(villageState1, routeRobot)
//   console.log(firstRobot)
// }
// compareRobots(routeRobot)


let isActive = true
let parcels = randomParcels(5)
let villageState = new VillageState("Post Office", parcels)
// The last parameter is the offset so can fit multiple animations on the screen
// offset of one is one village height
let animation1 = new Animation(villageState, goalOrientedRobot, [])
let animation2 = new Animation(villageState, randomaTron, [], 1)
let animation3 = new Animation(villageState, routeRobot, [], 2)


