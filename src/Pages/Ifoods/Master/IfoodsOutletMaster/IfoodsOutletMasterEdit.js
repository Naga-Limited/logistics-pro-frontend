/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
  CButtonGroup,
  CFormCheck
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DepoVehicleValidation from 'src/Utils/Depo/Vehicle/DepoVehicleValidation'

import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import IfoodsOutletMasterService from 'src/Service/Ifoods/Master/IfoodsOutletMasterService'

const IfoodsOutletMasterEdit = () => {
  const { id } = useParams()

  const formValues = {
    outlet_code: '',
    outlet_name: '',
    }

    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const navigation = useNavigate()

    console.log(user_info)

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    // console.log(user_locations)
    /*================== User Location Fetch ======================*/

    /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Outlet_Master

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

    const REQ = () => <span className="text-danger"> * </span>
    const [fetch, setFetch] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})
    const [submitBtn, setSubmitBtn] = useState(true)
    const [vehicleCapacityData, setVehicleCapacityData] = useState([])
    const [vehicleBodyData, setVehicleBodyData] = useState([])
    const [contractorData, setContractorData] = useState([])
    const [singleVehicleInfo, setSingleVehicleInfo] = useState([])
    const [vendor_name, setVendorName] = useState('')
    const [vendorError, setVendorError] = useState(true)
    const [vendorData, setVendorData] = useState([])

    const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
      changeVehicle,
      DepoVehicleValidation,
      formValues
    )


    useEffect(() => {


      if(singleVehicleInfo) {
        let outlet_code = !errors.outlet_code && values.outlet_code
      let outlet_name = !errors.outlet_name && values.outlet_name
      let outlet_contact_no = !errors.outlet_contact_no && values.outlet_contact_no
      let outlet_mail_id = !errors.outlet_mail_id && values.outlet_mail_id
    
        let condition_check =
        outlet_code &&
        outlet_name &&
        outlet_contact_no &&
        outlet_mail_id   
        console.log(condition_check,'condition_check')

        if (condition_check) {
          setSubmitBtn(false)
        } else {
          setSubmitBtn(true)
        }
      }
    }, [values, errors, singleVehicleInfo])

  function changeVehicle() {
    setFetch(false)
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('outlet_code',values.outlet_code)
    formData.append('outlet_name',values.outlet_name)  
    formData.append('outlet_contact_no', values.outlet_contact_no)
    formData.append('outlet_mail_id', values.outlet_mail_id)
    formData.append('updated_by', user_id)

    console.log(formData)

    IfoodsOutletMasterService.updateOutlets(id, formData).then((res) => {
      setFetch(true)
      if (res.status === 200) {
        for (let value of formData.values()) {
          console.log(value)
        }

        toast.success('Outlet Vehicle Updated Successfully!')

        setTimeout(() => {
          navigation('/IfoodsOutletMasterTable')
        }, 1000)
      }
    })
    .catch((error) => {
      setFetch(true)
      for (let value of formData.values()) {
        // console.log(value)
      }
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })
  }

  useEffect(() => {

    //section to fetch single Contractor info
    IfoodsOutletMasterService.getIfoodsOutletById(id).then((res) => {
      setFetch(true)
      let outlet_data = res.data.data
      console.log(res.data.data,'Outlet info')
      values.outlet_code = outlet_data.outlet_code
      values.outlet_name = outlet_data.outlet_name
      values.outlet_contact_no = outlet_data.outlet_contact_no
      values.outlet_mail_id = outlet_data.outlet_mail_id
   
      setSingleVehicleInfo(outlet_data)
 
    })

  }, [id])


  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          {screenAccess ? (
            <>
            
              <CCard>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                    <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                    <CRow className="mb-md-1">
                    <CCol md={3}>
                         <CFormLabel htmlFor="outlet_code">
                           Outlet Code 
                           
                         </CFormLabel>
                         <CFormInput
                           name="outlet_code"
                           size="sm"
                           maxLength={10}
                           id="outlet_code"
                           onChange={handleChange}
                           value={values.outlet_code}
                           onFocus={onFocus}
                           onBlur={onBlur}
                           placeholder=""
                         />
                       </CCol>
                       <CCol md={3}>
                         <CFormLabel htmlFor="outlet_name">
                         Outlet Name 
                           
                         </CFormLabel>
                         <CFormInput
                           name="outlet_name"
                           size="sm"
                           id="outlet_name"
                           onChange={handleChange}
                           value={values.outlet_name}
                           onFocus={onFocus}
                           onBlur={onBlur}
                           placeholder=""
                         />
                       </CCol>
                       <CCol md={3}>
                         <CFormLabel htmlFor="outlet_contact_no">
                         Outlet CUG NUmber 
                           
                         </CFormLabel>
                         <CFormInput
                           name="outlet_contact_no"
                           size="sm"
                           id="outlet_contact_no"
                           onChange={handleChange}
                           value={values.outlet_contact_no}
                           onFocus={onFocus}
                           onBlur={onBlur}
                           placeholder=""
                         />
                       </CCol>
                       <CCol md={3}>
                         <CFormLabel htmlFor="outlet_mail_id">
                         Outlet Maild ID 
                           
                         </CFormLabel>
                         <CFormInput
                           name="outlet_mail_id"
                           size="sm"
                           id="outlet_mail_id"
                           onChange={handleChange}
                           value={values.outlet_mail_id}
                           onFocus={onFocus}
                           onBlur={onBlur}
                           placeholder=""
                         />
                       </CCol>
                      </CRow>
                      <CRow className="mb-md-1">
                        <CCol
                          className="pull-right"
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            // type="submit"
                            disabled={submitBtn}
                            onClick={changeVehicle}
                          >
                            UPDATE
                          </CButton>
                          <Link to={'/IfoodsOutletMasterTable'}>
                            <CButton
                              size="s-lg"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                            >
                              BACK
                            </CButton>
                          </Link>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CTabPane>
                </CTabContent>
                {/* Error Modal Section */}
              <CModal visible={errorModal} backdrop="static" onClose={() => setErrorModal(false)}>
                <CModalHeader>
                  <CModalTitle className="h4">Error</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow>
                    <CCol>
                      {error && (
                        <CAlert color="danger" data-aos="fade-down">
                          {error}
                        </CAlert>
                      )}
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton onClick={() => setErrorModal(false)} color="primary">
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/* Error Modal Section */}
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default IfoodsOutletMasterEdit
