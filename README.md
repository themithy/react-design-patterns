# React software design patterns

This page describes the effort to explore the well-known software design
patterns (e.g. singleton, adapter) in terms of React programming, whether
implementing them using React semantics produces any viable outcome and 
brings any improvement is terms of code quality.

## Singleton

The *singleton* pattern seems to be the perfect starter, in terms that it is
easy to understand and has a well-foreseeable outcome in React. It also seems
to make sense in virtually every programming paradigm. A function that can be
called many times but is invoked only once is also a kind of singleton.

The implementation of this pattern can vary from simple effect (like attaching
only one a DOM listener) to a general HOC. However the basic idea is as
follows:

```js
const Singleton = () => {

  React.useEffect(() => {
    // do some action if ref count is 0.

    Singleton.refCount++

    () => {
      // destroy singleton if unmounting last reference.

      Singleton.refCount--
    }
  })

  return null
}

Singleton.refCount = 0
```

The fundamental idea (as in every other programming language) is to keep a
*static* property that contains the reference to the created object. Here in
the pseudo-code we also track the reference count, so that the singleton object
can be destroyed after the last reference is unmounted, but it does not have
to.

In the example code we create a whole React sub-tree, so that the state of the 
singleton component is persisted, even if the first reference unmounts.

The final outcome can go well-beyond having just a one component in vdom, we
can handle *props* update in any reference or have event callbacks behave in
similar way to generic listeners.

Please see an example in the code.

## Decoupling

The idea of decoupling or *louse coupling* exists behind many of the design
patterns. Is it not only the business logic or logic in general that can be
abstracted, but virtually every concept like algorithm, state, etc.; and this
list is open-ended.

Let us start with a very simple example below.

```js
const text = <Text color="paleBlue" />
```

The implementation of the `Text` class in not exactly right, because every time
a new color is added to the palette, we need to changed the class. A much
better solution would be to define the color outside, and pass it to the
instance of that class. This is what is called **dependency injection**.

```js
import { paleBlue } from 'colors'

const text = <Text color={paleBlue} />
```

## Bridge

Now let us consider a pattern very useful in front-end projects. A component
that seems very simple to implement but usually turns the opposite is the
button component. It starts with some border radius and primary and secondary
color palette. However in the life-time of the project several features are
requested that make this component bloated or split in two with not obvious
reason.  This includes:
* the color palette going well beyound primary and secondary.
* the necessity to display a icon on button.
* a link that should look like a button.

This is where the *bridge pattern* comes in play, as it decouples the
abstraction (how the component works) from the implementation (how the
component looks like).

```js
import { Button, Link } from 'abstraction'
import { ButtonUI, ButtonWithIconUI } from 'implementation'

<Button
  {...buttonProps} 
  uiComponent={ButtonWithIconUI}
  uiProps={...}
/>

<Link
  {...linkProps} 
  uiComponent={ButtonUI}
  uiProps={...}
/>
```

Please see an example in the code.

## Factory

The *factory pattern* allows to factor out the process of object creation.
This can have multiple purpose:
* the final object depends on the parameters.
* separate a simple object representation from the logic of creating it.

This seems especially useful in front-end programming to initialize ui
components from REST data.

```js
function factory(params) {
  let condition, prop
  
  // do some computation with params

  if (condition) {
    return <Object1 prop={prop} />
  }
  else {
    return <Object2 prop={prop} />
  }
}
```

A data to initialize a specific object can come from multiple sources (e.g.
REST endpoints), this is an example where *abstract factory* comes into play.
We define multiple factories, each per endpoint, which create the same object
based on different data.

## Builder

In the *builder pattern* the construction of an object, or even a composite,
is done in multiple steps, for example while chunks of data arrive. It should
the `toElement` function to return the final element.


```
class Builder {

  buildStep1() { ... }

  buildStep2() { ... }

  toElement() {
    return <Element {...someProps} />
  }
}
```

## Mediator

The *mediator pattern* allows two or more object to communicate without any of
this object depending on the other. This pattern is rarely seen in React
programming because the communication is usually handled by third-party
libraries or state containers, most notably *Redux*. This is not exactly right
for two simple reasons:
* A global state does not encapsulate the internals of the interaction.
* A global state is not well-suited for storing promises and functions.

```js
const mediator = new Mediator()

const Client = () => {
  return (
    <React.Fragment>
      <Object1 mediator={mediator} />
      <Object2 mediator={mediator} />
    </React.Fragment>
  )
}
```

Please see an example in the code.

## Observer

This one is what I would call an *intuitive* design pattern and is heavily used
in the wild.

```js
const Observer = () => {
  React.useEffect(() => {
    const someFunction = () => {}

    document.addEventListener('click', someFunction)

    return () => {
      document.removeEventListener('click', someFunction)
    }
  }, [])
}
```

## Decorator

The *decorator pattern* allows to "wrap" object in each other, providing that
they share the same interface and call each other methods. In React we are
concerned with only one method, namely the "render".

The implementation may differ, in class-based components the "HOC pattern" can
be seen as an utilisation of the decorator pattern. However it gets more
interesting when we get to function-based components. We can just wrap
functions with hooks in each other, obtaining the desired behaviour. There is
no need to call `React.createElement`, we can just call the component is if it
were an ordinary function, thus saving on levels in virtual DOM.

```js

const Counter = ({ count }) => {
  return <span>Count equals {count}</span>
}

const MultiplyCountDecorator = (counter) => {
  return ({ count, ...props }) => {
    return counter({ count: 2 * count, ...props })
  }
}

const DecoratedCounter = MultiplyCountDecorator(Counter)

```

`React.memo` is another example of a usage of the decorator pattern.

## Facade

This is also heavily used:

```js
const Facade = ({ generalProp }) => {
  return (
    <React.Fragment>
      <Object1 />
      <Object2 specificProp={generalProp} />
      <Object3 />
    </React.Fragment>
  )
}
```

## Memento

The internal state of the component can encapsulated and referenced using
the *forward ref* mechanism.

```js
React.useImperativeHandle(ref, () => ({
  createMemento: () => { return state },
  restore: (memento) => { setState(memento) },
}))
```

## Command

The *command pattern* is an excellent example of the general rule of design
patterns that is to encapsulate some behaviour.

In the following example the Wizard component will encapsulate the way the user
moves between corresponding steps. Any change in this logic (like for example
adding the possibility to move backward) will not affect the implementation
of particular steps.

When the command pattern is not used the logic of moving between steps (e.g.
via routing) is usually distributed among different components. Futher more
the accumulated state is not properly encapsulated but exposed in a global
state container like "redux".

```js
<Wizard
  steps={[
    Step1,
    Step2,
    Step3,
  ]}
/>
```

