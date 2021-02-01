var VillageState = class VillageState {
  constructor(place, parcels) {
    this.place = place
    this.parcels = parcels
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) return this;
    else {
      let parcels = this.parcels.map(p => {
        // console.log("parcel length " + this.parcels.length)
        // console.log("parcel place " + p.place)
        // console.log("p address " + p.address)
        if (p.place != this.place) return p
        return { place: destination, address: p.address}
      }).filter(p => p.place != p.address)
      return new VillageState(destination, parcels)
    }        
  }
}