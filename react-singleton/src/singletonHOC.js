
import React from 'react'
import ReactDOM from 'react-dom'

function singletonHOC(component) {

  function wrapper(props) {
    const ref = React.useRef()

    // This is asynchronous, maybe look for synchronous way ?
    React.useEffect(() => {

      if (wrapper.refCount === 0) {
        // first instance - initialize

        /*
         * This can be also a param to HOC ? or any instance ?
         */
        wrapper.container = document.createElement('div')
        document.body.appendChild(wrapper.container)

        const reactElement = React.createElement(component, props)

        /*
         * Creating additional react tree seems to be the way for the singleton
         * component to keep its internal state throughout its whole life,
         * and not forcing e.g. the first instance to be always present in vdom.
         */
        ReactDOM.render(reactElement, wrapper.container)
      }

      wrapper.refCount++

      console.log(`Mounted singleton instance, ref count is ${wrapper.refCount}.`)

      return () => {
        if (wrapper.refCount === 1) {
          // last instance - destroy

          ReactDOM.unmountComponentAtNode(wrapper.container)
          document.body.removeChild(wrapper.container)
        }

        wrapper.refCount--

        console.log(`Unmounted singleton instance, ref count is ${wrapper.refCount}.`)
      }
    }, [])

    return null
  }

  wrapper.refCount = 0

  return wrapper
}

export default singletonHOC

