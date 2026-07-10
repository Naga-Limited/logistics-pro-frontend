import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CInputGroupText,
  CInputGroup,
  CSpinner,
} from '@coreui/react'
import React from 'react'
import styled from 'styled-components'

const Input = styled.input.attrs((props) => ({
  type: 'text',
  size: props.small ? 5 : undefined,
}))`
  height: 2.5rem;
  width: 250px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
`

const ClearButton = styled.button`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 2.5rem;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <CCol md={4} className="d-flex">
      <CFormInput
        id="search"
        type="text"
        placeholder="Filter Table Data..."
        value={filterText}
        onChange={onFilter}
      />
      <CButton onClick={onClear}>X</CButton>
    </CCol>
  </>
)

export default FilterComponent

// OLD

// import React, { useEffect } from 'react'
// import {
//   CButton,
//   CCol,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
//   CSpinner,
// } from '@coreui/react'
// export const FilterComponent = ({ filterText, onFilter, onClear, fieldName }) => {
//   return (
//     <>
//       <CRow>
//         <CCol className="display-flex p-0">
//           <CInputGroup className="">
//             <CFormInput
//               size="sm"
//               id="search"
//               type="text"
//               name="search"
//               placeholder={`Search By ${fieldName}`}
//               aria-label="Search Input"
//               onChange={onFilter}
//               value={filterText}
//             />
//             <CInputGroupText>
//               <CButton size="sm" color="secondary" type="button" onClick={onClear}>
//                 X
//               </CButton>
//             </CInputGroupText>
//           </CInputGroup>
//         </CCol>
//       </CRow>
//     </>
//   )
// }
