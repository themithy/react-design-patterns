In declarative, component-wise programming it is sometimes desirable to detach
a certain component from the tree. React has a function for it, namely the
`createPortal`. This function renders the component in a different part of DOM,
but the component's definition stays in the same virtual tree where this
component logically belongs to. This also means that when the tree unmounts, the
component unmounts too.

The *poll pattern* allows to completely detach a component and render it as
a part of a different tree. The component is constructed as a result of an
action and passed to the poll via a messaging mechanism. The *poll* itself
defines how to handle a certain type of detached components.

Implementing a dialog is a good wasy to start with the poll pattern. Dialog is
problematic to component-wise programming because of the following reasons:

1. It does not fit well into the component hierarchy because it is always made
   global by CSS styles even if it is defined locally.

2. Whether an action is delayed or cancelled by a dialog should be transparent
   to a component triggering such action. Usually the component triggering
   and action sets the state displaying the dialog which is not transparent.

3. There is a stated needed to say whether the dialog is open or not. This is
   difficult to encapsulate because a dialog is rather an interruption in an
   arbitrary action and not a part of an application state. Unlike an "alert"
   for example.

So let us consider this dialog example and the *poll pattern* will emerge
clearly. Consider a button triggering an action.

```js
import { sendForm } from 'example-form'

<Button onClick={sendForm} />
```

Now the `sendForm` action should be wrapped or rather decorated by the dialog
handling functionality that will interrupt this action.

```js
import { sendForm } from 'example-form'

const [ onClick, dialog ] = decorateWithDialog(sendForm)

<React.Fragment>
  <Button onClick={onClick} />
  { dialog }
</React.Fragment>
```

The dialog is indeed transparent for the button but this approach has a
downside that we have to take special care for the modal to appear in DOM.
When this module unmounts for some reason (e.g. route change), the dialog will
unmount too as a side effect. How to fix that ? Display the dialog in the poll.

```js
function decorateWithDialog(action, messagingAPI) {
  return (...args) => {
    messagingAPI.postMessage({
      type: 'show-dialog',
      element: (
        <Dialog onSubmit={() => action(...args)} />
      ),
    })
  }
}
```

The dialog poll can be implemented like this:

```js
const DialogPoll = ({ messagingAPI }) => {
  const elements = []

  useEffect(() => {
    function receiveDialog(data) {
      if (data.type !== 'show-dialog') {
        return;
      }

      elements.push(data.element)
    }
  }, [messagingAPI])

  const enrichedElements = elements
    .map(element => {
      return cloneElement(element, {
        onCancel: () => elements.remove(element),
      })
    })

  return (
    <React.Fragment>
      {enrichedElements}
    </React.Fragment>
  )
})
```

So the final usage of a dialog in the application simplifies to this, very
transparent way:

```js
import { sendForm } from 'example-form'

const onClick = decorateWithDialog(sendForm)

<Button onClick={onClick} />
```

