
export function Mediator() {
  this.handles = []
}

Mediator.prototype.register = function(handle) {
  this.handles.push(handle)
}

Mediator.prototype.incrementAll = function() {
  this.handles.forEach((handle) => {
    handle.increment()
  })
}

