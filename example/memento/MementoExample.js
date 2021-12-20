
import React from 'react'

let Counter = (props, ref) => {
  const [ count, setCount ] = React.useState(0)

  React.useImperativeHandle(ref, () => ({
    createMemento: () => {
      console.log('Created memento with count ' + count)
      return { count }
    },
    restore: (memento) => {
      console.log('Restored memento')
      setCount(memento.count)
    },
  }))

  return (
    <div
      children={count}
      onClick={() => setCount(prevCount => prevCount + 1)}
      style={{ fontSize: '32px', userSelect: 'none' }}
    />
  )
}

Counter = React.forwardRef(Counter)

const Client = () => {

  const ref = new React.createRef()

  const [ memento, setMemento ] = React.useState()

  return (
    <React.Fragment>
      <Counter ref={ref} />

      <button 
        onClick={() => setMemento(ref.current.createMemento())}
        children="Create memento"
      />
      <button 
        onClick={() => ref.current.restore(memento)}
        children="Restore memento"
      />
    </React.Fragment>
  )
}

export default Client

