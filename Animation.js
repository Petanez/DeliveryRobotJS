document.body.style.margin = 0
document.body.style.padding = 0
const doc = document

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

function setStorage(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj))
}

const robotNames = ["routeRobot", "randomaTron", "goalOrientedRobot"]

function getAverageSteps(robotName) {
  let { averagesTotal, averagesCount } = getStorage(robotName)
  return Math.round(averagesTotal / averagesCount * 100) / 100
}

function getAllAverages() {
  for (let name of robotNames) {
    console.log(`Average steps for ${name} is ${getAverageSteps(name)}`)
  }
}


class Animation {
  // Offset to fit multiple animations at once
  constructor(VillageState, robot, robotState, offset = 0) {
    this.offset = offset
    // this.outer = doc.querySelector(".village-container")
    this.outer = doc.body.appendChild(doc.createElement("div"))
    this.bg = this.outer.appendChild(doc.createElement("div"))
    this.robot = robot
    this.storageKey = robot.name
    this.robotState = robotState
    this.VillageState = VillageState
    this.parcelStartCount = this.VillageState.parcels.length
    this.averageSteps;

    this.bg.style.cssText = `position:absolute; z-index: -10; background:url("img/village2x.png"); width:400px; height:300px; top: ${this.offset * 300}px;`
    
    this.robotCtx = this.outer.appendChild(doc.createElement("div"))
    this.robotCtx.innerText = robot.name.toUpperCase()
    this.robotCtx.style.cssText = `position: absolute; left: 410px; top: ${130 + this.offset * 300}px;`

    this.textCtx = this.outer.appendChild(doc.createElement("div"))
    this.textCtx.style.cssText = `position: absolute; left: 440px; top: ${150 + this.offset * 300}px; color: red;`

    this.robotEl = this.outer.appendChild(doc.createElement("div"))
    this.robotEl.style.cssText = `left: ${places[VillageState.place].x - 42}px; top: ${places[VillageState.place].y - 15 + this.offset * 300}px;
      position: absolute; transition: left ${0.8}s, top ${0.8}s;
      width: 40px; height: 40px;
    `
    let robotImg = this.robotEl.appendChild(doc.createElement("img"))
    robotImg.src = "img/robot_moving.gif";
    
    this.parcels = []
    this.turnCount = 0;
    this.updateParcels() 
    this.schedule()
  }

  updateView() {
    this.robotEl.style.left = `${places[this.VillageState.place].x - 45}px`
    this.robotEl.style.top = `${places[this.VillageState.place].y - 10 + this.offset * 300}px`
  }

  tick() {
    if (this.VillageState.parcels.length == 0) {
      clearTimeout(this.timeOut)
      this.updateParcels()
      this.robotEl.firstChild.src = "img/robot_idle.png"
      this.textCtx.style.fontSize = "30px"
      this.textCtx.innerText = "Done in " + this.turnCount + " turns "
      this.averageSteps = this.turnCount / this.parcelStartCount
      this.manageStorage(this.storageKey)
    } else {
      let { direction, memory } = this.robot(this.robotState, this.VillageState)
      this.robotState = memory
      this.updateParcels()
      this.VillageState = this.VillageState.move(direction, this.VillageState.parcels)
      this.schedule()
      this.updateView()
    }
  }
  
  schedule() {
    if (!isActive) return
    this.turnCount++
    this.textCtx.innerText = "Turn " + this.turnCount
    this.timeOut = setTimeout(() => {
      this.tick()
    }, 500)
  }

  updateParcels() {
    while (this.parcels.length) this.parcels.pop().remove()
    let heights = 0;
    for (let { place, address } of this.VillageState.parcels) {
      let offset = 0 - placeNames.indexOf(address) * 16
      let parcelEl = doc.createElement("div")
      if (place == this.VillageState.place) {
        parcelEl.style.cssText = `position: absolute;
          background-image: url("img/parcel2x.png"); top: ${7 - heights}px; left: 20px; background-position: 0px ${offset}px; background-repeat: no repeat;
          width: 16px; height: 16px;
        `
        heights += 16;
        this.robotEl.append(parcelEl)
        // console.log("this.parcels " + this.parcels)
      } else {
        parcelEl.style.cssText = `position: absolute;top: ${places[place].y - 5}px;left: ${places[place].x - 21}px;
        background-image: url("img/parcel2x.png"); background-position: 0px ${offset}px; background-repeat: no repeat;
        width: 16px; height: 16px;
      `
      this.bg.append(parcelEl)
      }
      this.parcels.push(parcelEl)
    }
  }

  manageStorage(key) {
    let stored = getStorage(key)
    console.log("Stored " + stored)
    if (!stored) { 
      let toStore = { averagesTotal: this.averageSteps, averagesCount: 1 }
      console.log(toStore)
      setStorage(this.storageKey, toStore)
    } else {
      let { averagesTotal, averagesCount } = stored
      console.log(averagesTotal, averagesCount)
      let toStore = { averagesTotal: averagesTotal += this.averageSteps, averagesCount: averagesCount += 1 }
      console.log(toStore)
      setStorage(this.storageKey, toStore)
    }
  }
    
}

