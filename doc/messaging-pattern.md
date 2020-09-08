The *messaging pattern* allows components to communicate with each other, but
unlike the mediator pattern which is local communication mechanism, this one is
semi-global. The internals are loosely fastened to the component tree. In
modern front-end applications message passing is usually implemented via a
global state container and is not properly encapsulated - which is the main
goal of patterns in general.

In the *messaging pattern* components exchange messages which is a common
technique to programming in general. The messaging pattern abstracts the way in
which components are embedded within the component tree and allow them to
communicate via a queue.

Let us reconsider the tooltip example used in the mediator pattern and 
apply the messaging pattern instead:

```js
const Trigger = ({ tooltipId }) => {
  const message = {
    action: 'toggle',
    tooltipId,
  }

  return (
    <Icon
      type="question-mark"
      onClick={() => window.postMessage(message)}
    />
  )
}
```

The `Trigger` component sends a message when clicked. Why do we use the window
messaging API ? For simplicity, because it is the messaging mechanism
implemented in native JavaScript.  The `Tooltip` component listens to arriving
messages and updates the state when necessary.

```js
const Tooltip = ({ tooltipId }) => {
  const [ open, setOpen ] = useState(false)

  useEffect(() => {
    function receiveMessage(event) {
      /* TODO: check origin for security */

      if (event.data.tooltipId !== tooltipId) {
        return;
      }

      if (event.data.action === 'toggle') {
        setOpen(open => !open)
      }
    }

    window.addEventLister('message', receiveMessage)

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [])

  return (
    <Balloon
      visible={open}
      onClick={() => setOpen(false)}
    />
  )
}
```

The messages are identified by a string, we need to make sure that those
identifiers are unique. Here is how the invocation of the components looks
like:

```js
<React.Fragment>
  <Trigger tooltipId="example-tooltip" />
  <Tooltip tooltipId="example-tooltip" />
</React.Fragment>
```

Although this approach is ready to go, it has also some drawbacks - you cannot
pass functions and promises, but should be able to so. However it is not
difficult to implement the messaging internals ourselves to circumvent this
limitation, bypass eventual security problems, and make this mechanism
semi-global.

