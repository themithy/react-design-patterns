
import React from 'react'

export const Counter = ({
  mediator,
}) => {
  const [ count, setCount ] = React.useState(0)

  React.useEffect(() => {
    const handle = { increment: () => setCount(prevCount => prevCount + 1) }
    mediator.register(handle)
  }, [ mediator ])

  return (
    <div
      children={count}
      onClick={() => mediator.incrementAll()}
      style={{ fontSize: '32px', userSelect: 'none' }}
    />
  )
}

