
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
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationListComponent from 'src/components/commoncomponent/LocationListComponent'
import DepoContractorValidation from 'src/Utils/Depo/Contractor/DepoContractorValidation'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import PanDataService from 'src/Service/SAP/PanDataService'
import RakeVendorValidation from 'src/Utils/RakeMovement/RakeVendorValidation'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
const FCILocationMasterEdit = () => {
  const formValues = {
    contractorNumber: '',
    contractorCode: '',
    contractorOwnerName: '',
    contractorName: '',
    contractorAddress: '',
    contractorLocation: '',
    contractorPhoto: '',
    freightType: '',
    gstType: '',
    tdsType: '',
  }

  const { id } = useParams()

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
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_Location_Master

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
  const [fciLocationsData, setFciLocationsData] = useState([])
  const [tdsTaxData, setTdsTaxData] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [locationError, setLocationError] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    updateOldLocation,
    RakeVendorValidation,
    formValues
  )   
  

  const remarksHandleChange = (event,type) => {
    var val_taken = event.target.value
    if(type == 1){
      let need_val = val_taken.replace(/[^a-zA-Z ]/gi, '')
      let result = need_val.toUpperCase(); 
      setLocationName(result.trimStart())
    } else if(type == 2){
      let getData7 = val_taken.replace(/[^A-Z]/gi, '')
      let result1 = getData7.toUpperCase()  
      setLocationSymbol(result1.trimStart())
    } else {  
      //
    }

  }

  const [locationName, setLocationName] = useState('') 
  const [locationCode, setLocationCode] = useState('') 
  const [locationSymbol, setLocationSymbol] = useState('')  
  const [singleLocation, setSingleLocation] = useState({})   
  const [mount, setMount] = useState(1)

  useEffect(() => {
    //section to fetch single Location Master info
    DefinitionsListApi.getDefinitionsListById(id).then((response) => {
      setFetch(true)
      let resData = response.data.data
      console.log(response,'response')
      setLocationName(resData.definition_list_name)
      setLocationCode(resData.definition_list_code)
      setLocationSymbol(resData.definition_list_alpha_code)
      setSingleLocation(resData)
    })

  }, [id])

  const locationNameExists = (name) => {
    let name_exists = false
    fciLocationsData.map((vv,kk)=>{
      if(vv.definition_list_name == name){
        name_exists = true
      }
    })
    return name_exists
  }

  const locationSymbolExists = (symbol) => {
    let symbol_exists = false
    fciLocationsData.map((vv,kk)=>{
      if(vv.definition_list_alpha_code == symbol){
        symbol_exists = true
      }
    })
    return symbol_exists
  }

  useEffect(() => {

    /* section for getting FCI Location Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {

     let viewData = response.data.data
      console.log(viewData,'viewData')
      setFciLocationsData(viewData)
   })

 }, [])

  function updateOldLocation() {
    console.log(singleLocation,'singleLocationData')
    if(user_info.is_admin == 1){
      console.log(fciLocationsData,'fciLocationsData')
      console.log(locationCode,'locationCode')
      console.log(locationSymbol,'locationSymbol')
      console.log(locationName,'locationName') 
    }
    
    if(locationName == ''){
      toast.warning('Location Name Required')
      return false
    }

    if(locationSymbol == ''){
      toast.warning('Location Symbol Required')
      return false
    }

    if(locationSymbol.length < 3){
      toast.warning('Location Symbol Length should be 3 Digit')
      return false
    }

    if(locationName != singleLocation.definition_list_name && locationNameExists(locationName)){
      toast.warning('Location Name already exists..')
      return false
    }

    if(locationSymbol != singleLocation.definition_list_alpha_code && locationSymbolExists(locationSymbol)){
      toast.warning('Location Symbol already exists..')
      return false
    }

    setFetch(false)

    let updateValues = {
      def_title_id: 34,
      def_list_name: locationName,
      def_list_code: locationCode,
      def_list_alpha_code: locationSymbol,
      updated_by: user_id,
    }

    DefinitionsListApi.updateDefinitionsList(updateValues, id).then((res) => {
        setFetch(true)
        console.log(res,'res-locationCode')
      if (res.status == 200) {          
        toast.success('Location List Updated Successfully!')
        setMount((prevState) => (prevState = prevState + 1)) 
        setTimeout(() => {
          navigation('/FCILocationMasterHome')
        }, 500)
      }
    })
    .catch((error) => { 
      setFetch(true)
      setError(error.res.data.errors.def_title[0]) 
    })
  }

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
                    <div className="row g-3 m-2 p-1">
                      <CRow className="mb-md-1">
                        <CCol md={3}>
                          <CFormLabel htmlFor="locationName">
                            Location Name <REQ />{' '}
                          </CFormLabel>
                          <CFormInput
                            name="locationName"
                            size="sm"
                            id="locationName"
                            maxLength="20"
                            onChange={(e) => {remarksHandleChange(e,'1')}}
                            type="text"
                            value={locationName}
                          />
                        </CCol>                        
                        <CCol md={3}>
                          <CFormLabel htmlFor="locationSymbol">
                            Location Symbol<REQ />{' '}
                          </CFormLabel>
                          <CFormInput
                            name="locationSymbol"
                            size="sm"
                            id="locationSymbol"
                            maxLength="3"
                            onChange={(e) => {remarksHandleChange(e,'2')}}
                            type="text"
                            value={locationSymbol}
                          />
                        </CCol>  
                        <CCol md={3}>
                          <CFormLabel htmlFor="locationCode">
                            Location Code 
                          </CFormLabel>
                          <CFormInput
                            name="locationCode"
                            size="sm"
                            id="locationCode"
                            readOnly 
                            type="text"
                            value={locationCode} 
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
                            onClick={updateOldLocation}
                          >
                            UPDATE
                          </CButton>
                          <Link to={'/FCILocationMasterHome'}>
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
                    </div>
                  </CTabPane>
                </CTabContent>
                {/* Error Modal Section */}
                  <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
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
export default FCILocationMasterEdit

