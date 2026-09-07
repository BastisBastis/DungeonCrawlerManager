import { EventCenter } from "../helpers/EventCenter"

export const createTimedEventSystem=(world)=>{

  var events = []

  const onAddTimedEvent=(data)=> {
    events.push({
      time:data.time,
      callback:data.callback,
      timer:0
    })
  }

  EventCenter.on("addTimedEvent", onAddTimedEvent)
  
  return (world, dt)=>{
    
    events = events.filter(event=>{
      event.timer += dt
      if (event.timer >= event.time) {
        event.callback()
        return false
      }
      return true

    })
    
    
    
    return world
  }
}