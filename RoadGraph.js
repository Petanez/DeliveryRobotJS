function createRoadGraph(roads) { 
  return roads.reduce((obj, road) => {
    const [ from, to ] = road.split("-")
    let graph = addToRoads(obj, from, to)
    return graph = addToRoads(graph, to, from)
  }, {})
}

function addToRoads(obj, from, to) {
  if (!obj[from])
    obj[from] = [to]
  else 
    obj[from].push(to)
  return obj
}