
import React from 'react'

const Step1 = () => <div>Step1</div>

const Step2 = () => <div>Step2</div>

const Step3 = () => <div>Step3</div>

const Wizard = ({ steps }) => {
  const [ idx, setIdx ] = React.useState(0)

  const step = React.createElement(steps[idx])

  return (
    <React.Fragment>
      { step } 

      { idx + 1 < steps.length && (
        <button
          children="Go to next step"
          onClick={() => setIdx(prevIdx => prevIdx + 1)}
        />
      )}
    </React.Fragment>
  )
}

const Client = () => {
  return (
    <Wizard
      steps={[
        Step1,
        Step2,
        Step3,
      ]}
    />
  );
}

export default Client

