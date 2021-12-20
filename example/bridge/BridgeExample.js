
import React from 'react'

const ButtonUI = ({
  theme,
  ...props
}) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.color,
      }}
    />
  )
}

const Link = ({
  url,
  uiComponent,
  uiProps,
  children,
}) => {
  const bridgeProps = {
    ...uiProps,
    onClick: () => window.open(url, '_blank') 
  }

  return React.createElement(uiComponent, bridgeProps, children)
}

const Client = () => {
  const theme = { backgroundColor: 'blue', color: 'white' }
  return (
    <Link
      url="http://github.com/themithy/react-design-patterns"
      uiComponent={ButtonUI}
      uiProps={{ theme }}
    >
      See other patterns
    </Link>
  )
}

export default Client

