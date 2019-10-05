
import React from 'react'

const Counter = () => {
  const [ count, setCount ] = React.useState(0)

  return (
    <div
      children={count}
      onClick={() => setCount(prevCount => prevCount + 1)}
      style={{ fontSize: '32px', userSelect: 'none' }}
    />
  )
}

export default Counter

