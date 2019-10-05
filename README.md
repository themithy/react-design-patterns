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

## Memento

It seems to be easy to implement Memento using `useImperativeHandle`. TBD.

## Bridge

This one seems to be very interesting, needs more exploration. TBD.

