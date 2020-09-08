The *bridge pattern* decouples two aspects, how the components works and how
it looks. The nature of a component makes it a perfect unit for encapsulation,
not only on the visual level (html, css) but also on a functional level,
because in modern front-end programming those two things are tightly coupled
together. Consider a dropdown for example, from the visual perspective it
consist of a button and a list, but from the functional perspective it can be
opened, closed by clicking outside, etc... This however has the downside that
sometimes those concerns are not properly separated, even if they should be.

Here we start we a simple example - a button. The complexity of this component
is often overlooked, because it appears to be just a html component with some
styling, isn't it ? However the functionality of the button component is
extended when the application grows: new themes arrive (like warning, or danger
states), an icon needs to be displayed instead of text, the button needs to
behave like a link or like an external link, etc. In the end the component
becomes bloated, or strange entities start to appear, like
`IconButtonExternalLink`, for example.

This makes the button a perfect (and easy to understand) candidate for
decoupling. We define a visual component first:

```js
const ButtonUI = ({
  tag,
  ...other,
}) => {
  /* Construct class name from things like "disabled", "active", and so on */
  const className = `button-ui ${prop.disabled ? 'disabled' : ''}`

  const props = {
    className,
    ...other,
  }

  return createElement(tag, props)
}
```

Next we construct a pure utility component and make it take the visual
component as a parameter:


```js
const Button = ({
  uiComponent,
  uiProps,
  ...other,
}) => {
  const props = {
    ...uiProps,
    tag: 'button',
    type: 'submit',
    ...other,
  }

  return createElement(uiComponent, props)
}

<Button
  uiComponent={ButtonUI}
  uiProps={{ disabled: true }}
  onClick={() => {/* onclick */}}
/>
```

Now instead of a button we define a link component that can be displayed
visually as a button, or something else.

```js
component Link = ({
  url,
  uiComponent,
  uiProps,
  ...other,
}) => {

  function onClick() {
    history.pushState({} /* state */, '' /* title */, url)
  }

  const props = {
    ...uiProps,
    tag: 'a',
    title: url,
    onClick,
    ...other,
  }

  return createElement(uiComponent, props)
}
```

The interfaces of components do not have to be defined in the same way as in
the examples. The visual component can be passed in any way, I define them as
"pass as factory", "pass as element", "pass as constructor", in a different
article.

Here is the `Button` component that takes the "pass as factory" approach:

```js
const Button = ({
  render,
  ...other,
}) => {
  return render({
    tag: 'button',
    type: 'submit',
  })
}
```

When new components arrive, like for example `IconButton`, `ExternalLink`, 
and so; they can be fit nicely into the "bridge approach", and the increase
in the number of components in the application is linear and not quadratic.

The components themselves can be quite complex in behaviour but will work
together as long they obey the interfaces. Imagine a situation in which we
display a dialog before going to an external site:

```js
const WarnBeforeNavigatingLinkUI = ({
  title,
  onClick,
}) => {
  const [ open, setOpen ] = useState()

  return (
    <React.Fragment>
      <a
        href="#"
        title={title}
        onClick={() => setOpen(true)}
      >
        This link may take you to an external site
      </a>

      { open && (
        <Dialog onSubmit={onClick}>
          Are you sure you want to proceed ?
        </Dialog>
      )}
    </React.Fragment>
  )
}

<Link
  uiComponent={WarnBeforeNavigatingLinkUI}
/>
```

