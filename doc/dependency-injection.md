*Dependency injection* is a generic concept that states that dependencies of a
component should be passed to it from the outside and not be defined inside.

Components of different level of abstraction do exist in the application,
simple and complex ones. Simple components are usually ui-related so their
properties, but complex components provide sophisticated behaviour and are
bound with state and so called side effects (e.g. remote calls).

However components are always tightly coupled with the underlying DOM which is
undesired when a certain level of abstraction is to be reached. This has the
following effect that different unrelated components are mixed in the same
code, so do their properties. The logic is then mixed with visual
representation which is undesirable.

A good illustration of the problem is mixing the layout with elements that
are embedded in the layout. More often that not those are pretty complex
components like navigation or such. Changing the display code results in
changing the "logic-related" code for example when there is a change in the
layout. Consult the following example: when filters go to the top of the
screen, the whole code changes.

```js
<Column>
  <TabularData
    data={data}
    sorting={options.sorting}
  />
  <Row>
    <Filters
      filters={options.filters}
    />
    <Pagination
      limit={options.limit}
      offset={options.limit}
    />
  </Row>
</Column>
```

The goal is now to decouple the layout from the logical representation of the
filterable table. When one of them needs to be altered, a change is required in
only one part of the code. This can be accomplished using the *dependency
injection* strategy:

```js
const TabularLayout = ({
  table,
  filters,
  pagination,
}) => {
  return (
    <Column>
      {table}
      <Row>
        {filters}
        {pagination}
      </Row>
    </Column>
  )
}

<TabularLayout
  table={(
    <TabularData
      data={data}
      filters={options.filters}
    />
  )}
  filters={(
    <Filters
      filters={options.filters}
    />
  )}
  pagination={(
    <Pagination
      limit={options.limit}
      offset={options.limit}
    />
  )}
/>
```

The dependencies are now injected into the layout component and no longer
defined within it, but somewhere outside. When we change the table to grid the
layout does not change. On the other hand when there is a change in layout the
table logic stays the same. The things are now properly abstracted and
separated.

This style of programming reduces the need for property passing which can be
bloated in large applications. It is much better to "arm" a component with
properties on a high level and pass the entire component down to a lower level.
The problem of property passing is increased by the fact the properties are
often required to pass many levels and not only one level as in the
before-mentioned example. 

```js
// wrong

<Header
  exit-icon='door-icon'
  onExit={closeApplication}
/>

// ok

<Header
  exitElement={(
    <Button
      icon='door-icon'
      onClick={closeApplication}
    />
  )}
/>
```

A good rule of a thumb should be that the more complex the component, the
higher should it be defined. It is not uncommon to see very complex components
twenty-levels deep in the component tree which hinders proper abstraction and
reuse.

