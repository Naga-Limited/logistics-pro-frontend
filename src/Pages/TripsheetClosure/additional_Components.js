import React, { useEffect, useState } from 'react'
export const ParentComponent = ({ children, addComponent }) => {
  return (
    <>
      <button onClick={addComponent}>Add another component</button>
      <div>{children}</div>
    </>
  )
}

export const ChildComponent = () => {
  return <h4>This is a child component</h4>
}
