import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="fixed">
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer"></a>
        <span className="ms-1"> Copy Rights &copy; Naga Limited, All Rights Reserved.</span>
      </div>
      {/* <div className="ms-auto">
        <span className="me-1">Website : </span>
        <a href="https://www.nagamills.com/" target="_blank" rel="noopener noreferrer">
          Naga Limited
        </a>
      </div> */}
    </CFooter>
  )
}

export default React.memo(AppFooter)
