import React from 'react'
import { CButton, CBadge } from '@coreui/react'

const CustomSpanButton = ({ handleViewDocuments, vehicleId, documentType }) => {
  return (
    <>
      <span>
        <CBadge
          color="secondary"
          type="button"
          onClick={(e) => handleViewDocuments(e, vehicleId, documentType)}
          className="w-100 m-0"
          id="inputAddress"
        >
          {/* <CButton
            onClick={(e) => handleViewDocuments(e, vehicleId, documentType)}
            className="w-100 m-0"
            color=""
            size="sm"
            id="inputAddress"
          > */}
          <span className="float-start">
            <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;VIEW
          </span>
          {/* </CButton> */}
        </CBadge>
      </span>
    </>
  )
}

export default CustomSpanButton
