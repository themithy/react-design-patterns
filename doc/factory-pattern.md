The *factory pattern* encapsulates the process of creating a component.  It is
especially useful when creating components out of REST data. Look at the
following example, even the actual class of the returned component may be unknown
at the time of invoking the function.

```js
function renderError({ status }) {
  if (status < 500) {
    return <GenericError />
  }
  
  return <InternalServerError />
}
```

In the next example the factory function is used to separate a visual component
from the data representation. The computation of properties is done inside the
factory function and hidden from the outer world.

```js
function renderUser(user) {

  const username = user.loggedin ? user.username : 'anonymous'

  return (
    <User
      username={username}
    />
  );
}
```

By writing multiple factories one can maintain generic front-end code and prevent
the details of back-end implementation from leaking into components. This can
be thought of as *abstract factory pattern*.

```js
function renderSimpleUser() {
  // ...
  return <User {...userProps}>;
}

function renderComplexUser() {
  // ...
  return <User {...userProps}>;
}

const userComponent1 = renderSimpleUser(api.getSimpleUser());
const userComponent2 = renderComplexUser(api.getComplexUser());
```

It is a common pattern to use factory function to pass lazily-initialized
components down the tree. This is sometimes called a "render function" but I
prefer to call this pattern "pass-as-factory", as opposed to other methods of
passing components.

```js
function renderCell() {
  return <Cell {...cellParentProps} />
}

return (
  <Table
    renderCell={renderCell}
  />
)
```

