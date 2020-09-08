The communication between different components is usually implemented in a way
that a common state is extracted and moved up in the tree, and the
communication is handled via callbacks. Alternatively the state is moved a to
global state container and the components operate on the global namespace.
Those two approaches have however this main downside that the communication is
not properly encapsulated. Furthermore reuse is difficult.

The *mediator pattern* captures the way in which components interact by
allowing them to "talk to each other". It further makes no assumption on where
the state is implemented because it is purely concerned with communication.
This has the advantage that less changes are required when the application
grows, because the components are loosely coupled.

Consider a tooltip example which provides a visual hint to the user in a form
of a white "balloon". Such tooltip usually has one or more triggers that display
the tooltip. Furthermore the state is local to the tooltip component. We first
define the mediator object that will facilitate the communication between the 
very tooltip and its triggers.

```js
function createTooltipMediator() {
  const actions = []

  return {
    callAction: (callback) => actions.forEach(action => action(callback)),
    register: (action) => actions.push(action),
  }
}
```

Now code the trigger component which is just a help icon that will make the
tooltip appear when clicked. The trigger takes the mediator as a parameter.

```js
const Trigger = ({ mediator }) => {
  return (
    <Icon
      type="question-mark"
      onClick={() => mediator.callAction(open => !open)}
    />
  )
}
```

The tooltip component will register a callback to the mediator to listen
whether any of the triggers was clicked. Note that the mediator pattern
can encapsulate any form of communication, not necessarily in the form
of publisher/subscribe.

```js
const Tooltip = ({ mediator }) => {
  const [ open, setOpen ] = useState(false)

  useEffect(() => {
    mediator.register(setOpen)
  }, [mediator])

  return (
    <Balloon
      visible={open}
      onClick={() => setOpen(false)}
    />
  )
}
```

The final example also contains a listener to background clicks.

```js
const mediator = createTooltipMediator()

<React.Fragment>
  <Trigger mediator={mediator} />
  <OutsideClickListener mediator={mediator} />

  <Tooltip mediator={mediator} />
</React.Fragment>
```

It is common to pass the state and callbacks to components separately when not
using the mediator pattern.  The mediator wraps them together to an object
exposing a certain interface. The only downside is that the mediator object
itself is fixed to the component tree which is not convenient when the mediated
components are far apart. The *messaging pattern* can be used instead and is
described in a different article.

