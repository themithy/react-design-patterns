
import React from 'react'
import ReactDOM from 'react-dom'

import SingletonExample from './singleton/SingletonExample'
import MediatorExample from './mediator/MediatorExample'
import BridgeExample from './bridge/BridgeExample'
import MementoExample from './memento/MementoExample'
import CommandExample from './command/CommandExample'

const App = () => {
  const [ example, setExample ] = React.useState()

  return (
    <React.Fragment>
      <div style={{ width: '100%', height: '50px' }}>
        <button
          children="Singleton"
          onClick={() => setExample('singleton')}
        />
        <button
          children="Mediator"
          onClick={() => setExample('mediator')}
        />
        <button
          children="Bridge"
          onClick={() => setExample('bridge')}
        />
        <button
          children="Memento"
          onClick={() => setExample('memento')}
        />
        <button
          children="Command"
          onClick={() => setExample('command')}
        />
      </div>

      { example === 'singleton' && <SingletonExample /> }
      { example === 'bridge' && <BridgeExample /> }
      { example === 'mediator' && <MediatorExample /> }
      { example === 'memento' && <MementoExample /> }
      { example === 'command' && <CommandExample /> }
    </React.Fragment>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App />, root) 

