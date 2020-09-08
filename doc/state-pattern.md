## State pattern

It is common in component programming to treat a component as a basic unit of
encapsulation.  This is a very natural way of programming which is fostered by
React's "component nature". A component in React is a synonym of object in
object-oriented programming languages.

Therefore it might be common to see such components in the application code:
`Input`, `MaskedInput`, `UpperCaseInput`, `ThrottledInput`, and so on.  Here a
propose a different take on this problem.  It is easy to observe the `Input`
does not change at all, what changes is the state representation.  So let us
propose the following objects: `SimpleState`, `MaskedState`, `UpperCaseState`,
`ThrottledState`, etc. that are all consumed by a single `Input` component.

Now let us declare the interface of the `Input` component with and without the
state pattern:

```js
// w/o state pattern
<Input
  initialValue={initialValue}
  value={value}
  onChange={onChange}
  onBlur={onBlur}
/>

// with state pattern
<Input state={state} />
```

All the internals of the input are now hidden behind its interface. If now
we want to react to the `onblur` event and not the `onchange` event, we
do not need to modify how the `Input` component is called. To good thing is 
that the clumsy `event.target.value` is no longer exposed in the outer code.

Furthermore the interface is no longer concerned with the question whether this
is a "controlled" or "uncontrolled" component, this left to state
implementation.

Now let us define the state object which implements the state pattern by
encapsulating for example the representation of a email. Using classes.

```js
const emailState = {
  getValue: () => this.state.email,
  setValue: (email) => this.setState({ email }),
}

<Input state={emailState} />
```

With hooks this feels even more natural:

```js
const emailState = useState()

<Input state={emailState} />
```

The `Input` component now merely represents an enhanced html control, but when
there is an actual change in the value, this should be moved to the state object.
What if we want to allow/display only upper case text ?

```js
function createUpperCaseState() {
  const [value, setValue] = useState()

  return {
    getValue: () => value,
    setValue: (newValue) => setValue(newValue.toUpperCase()),
  }
}

const upperCaseState = createUpperCaseState()

<Input state={upperCaseState} />
```

The actual implementation does not matter match, we can use an another hook, a
constructor, or even a *decorator pattern*:

```js
function createThrottledState(immediateState) {
  const [ throttledValue, setThrottledValue ] = useState()

  const throttleFunc = throttle((newValue) => {
    setThrottledValue(newValue)
  }, 1000)

  const setValue = (newValue) => {
    immediateState.setValue(newValue)
    throttleFunc(newValue)
  }

  return {
    getValue: immediateState.getValue,
    getThrottledValue: () => throttledValue,
    setValue: useCallback(setValue, [immediateState]),
  }
}

const immediateState = createSimpleState()
const throttledState = createThrottledState(immediateState)

<Input state={throttledState} />

<span>{throttledState.getThrottledValue()}</span>
```

Finally, the `Input` component itself looks like this:

```js
const Input = ({ state }) => {
  const {
    getInitialValue,
    getValue,
    setValue,
  } = state

  return (
    <input
      defaultValue={getInitialValue ? getInitialValue() : undefined}
      value={getValue ? getValue() : undefined}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}
```

