
import React from 'react'

import singletonHOC from './singletonHOC'
import Counter from './Counter'

const SingletonCounter = singletonHOC(Counter)

const Client = () => {
  const [ mounted1, setMounted1 ] = React.useState(false)
  const [ mounted2, setMounted2 ] = React.useState(false)
  const [ mounted3, setMounted3 ] = React.useState(false)

  return (
    <React.Fragment>
      <button
        children={mounted1 ? 'Unmount' : 'Mount'}
        onClick={() => setMounted1(mounted => !mounted)}
      />
      <button
        children={mounted2 ? 'Unmount' : 'Mount'}
        onClick={() => setMounted2(mounted => !mounted)}
      />
      <button
        children={mounted3 ? 'Unmount' : 'Mount'}
        onClick={() => setMounted3(mounted => !mounted)}
      />

      { mounted1 && <SingletonCounter /> }
      { mounted2 && <SingletonCounter /> }
      { mounted3 && <SingletonCounter /> }
    </React.Fragment>
  )
}

export default Client
