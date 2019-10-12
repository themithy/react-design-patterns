
import React from 'react'

import { Counter } from './Counter'
import { Mediator } from './Mediator'

const Client = () => {

  const mediator = new Mediator()

  return (
    <React.Fragment>
      <Counter mediator={mediator} />
      <Counter mediator={mediator} />
      <Counter mediator={mediator} />
    </React.Fragment>
  )
}

export default Client

