# Strategy pattern

The *strategy pattern* is a way to encapsulate algorithms and inject them into
components, thus fostering the inversion of control paradigm. The internals of
the algorithm are decoupled from the component which provides a good separation
layer.

In the following example any function can be chosen to format the data inside
the list, so that the list component can stay independent of visual
representation of items it contains.

```js
<List
  data={data}
  formatDataItem={item => (<i>{item}</i>)}
/>
```

In the next example we use the strategy pattern to normalize input data.

```js
const Input = ({ normalize }) => {
  const [ value, setValue ] = useState('')

  return (
    <input
      value={text}
      onChange={({ target }) => setValue(normalize(target.value))}
    />
  )
}

// ...

<Input 
  normalize={text => text.toUpperCase()}
/>
```

The strategy function can be used to change the way in which a component reacts
to events. In the next example we decide how the tooltip changes its visibility
when clicked:

```js
function clickStrategy(clickEvent, state) {
  const [ open, setOpen ] = state
  setOpen(!open)
}

// ...

<Tooltip
  clickStrategy={clickStrategy}
/>
```

It can be also used to introduce stateful logic to components that are
otherwise stateless. It might be sometimes useful to disable accidental double
clicks in buttons.

```js
let lastEvent = null

function clickStrategy(clickEvent) {
  if (lastEvent && clickEvent.timeStamp - lastEvent.timeStamp < 1000) {
    clickEvent.preventDefault()
  }

  lastEvent = clickEvent
}

// ...

<Button
  clickStrategy={clickStrategy}
/>
```

In general the strategy pattern is not limited to algorithms like quick sort or
else, but to any function that operates on data, also tightly coupled to DOM
  model.

