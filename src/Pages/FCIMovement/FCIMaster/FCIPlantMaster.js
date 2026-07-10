/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol, 
  CFormInput,
  CFormLabel, 
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
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'  
import FCIPlantValidation from 'src/Utils/FCIMovement/FCIPlantValidation'
import useFCIPlantForm from 'src/Hooks/useFCIPlantForm'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FCIPlantMaster = () => {

    const formValues = { 
        plant_name: '',
        plant_symbol: '',
        plant_code: '',
        company_name: '',
        street_no: '',
        street_name: '',
        city: '',
        state: '',
        postal_code: '',
        region: '',
        gst_no: '',
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
    const [fciPlantsData, setFciPlantsData] = useState(false) 
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})

    const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useFCIPlantForm(
        addNewPlant,
        FCIPlantValidation,
        formValues
    ) 

    const latestLocationCodeFinder = () => {
        console.log(fciPlantsData,'fciPlantsData')
        let last_fci_plant_code = fciPlantsData.length
        console.log(last_fci_plant_code,'last_fci_plant_code')
        let prev_code = last_fci_plant_code-1
        console.log(prev_code,'prev_code')
        if(last_fci_plant_code && last_fci_plant_code > 1){
        let data = Number(parseFloat(fciPlantsData[prev_code].plant_code).toFixed(2))
        console.log(fciPlantsData[prev_code].plant_code,'fciPlantsData[prev_code].plant_code')
        console.log(data,'data')
        return data+1
        } else {
        return '-'
        }
        
    }

  const locationNameExists = (name) => {
    let name_exists = false
    fciPlantsData.map((vv,kk)=>{
        if(vv.plant_name == name){
            name_exists = true
        }
    })
    return name_exists
  } 

  const locationSymbolExists = (symbol) => {
    let symbol_exists = false
    fciPlantsData.map((vv,kk)=>{
        if(vv.plant_symbol == symbol){
            symbol_exists = true
        }
    })
    return symbol_exists
  }

  useEffect(() => {

    /* section for getting FCI Plant Lists from database */
    FCIPlantMasterService.getFCIPlantRequestTableData().then((response) => {
        setFetch(true)
        let viewData = response.data.data
        console.log(viewData,'getFCIPlantRequestTableData')
        setFciPlantsData(viewData)
    })

 }, [])

 const allFieldsNotFilled = () => {

    if(values.plant_name == '' || values.plant_symbol == '' || values.region == '' || values.company_name == '' || values.street_no == '' || values.street_name == '' || values.city == '' || values.state == '' || values.postal_code == '' ){
        return true
    }

    return false
 }

  function addNewPlant() {

    console.log(errors,'errors')
    if(Object.keys(errors).length != 0 || allFieldsNotFilled()){
        toast.warning('One of the field was not filled. Kindly check and submit..')
        return false
    }     

    if(latestLocationCodeFinder() == '-'){
      toast.warning('Plant Code Invalid')
      return false
    }   
    
    if(locationNameExists(values.plant_name)){
        toast.warning('Plant Name already exists..')
        return false
    }
  
    if(locationSymbolExists(values.plant_symbol)){
        toast.warning('Plant Symbol already exists..')
        return false
    } 
    
    setFetch(false)

    const formData = new FormData() 

    formData.append('plant_name', values.plant_name) 
    formData.append('plant_symbol', values.plant_symbol) 
    formData.append('plant_code', latestLocationCodeFinder()) 
    formData.append('company_name', values.company_name) 
    formData.append('street_no', values.street_no) 
    formData.append('street_name', values.street_name) 
    formData.append('city', values.city) 
    formData.append('state', values.state) 
    formData.append('postal_code', values.postal_code) 
    formData.append('region', values.region) 
    formData.append('gst_no', values.gst_no) 
    formData.append('plant_status', 1) 
    formData.append('remarks', values.remarks) 
    formData.append('created_by', user_id) 


    FCIPlantMasterService.createFCIPlant(formData).then((res) => {

      if (res.status === 201) {
        setFetch(true)
        toast.success('Plant Created Successfully!')

        setTimeout(() => {
          navigation('/FCIPlantMasterHome')
        }, 1000)
      }
    })
    .catch((error) => {
      console.log(error,'error')
      setFetch(true)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
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
                            <CFormLabel htmlFor="plant_name">
                                Plant Name <REQ />{' '}
                                {errors.plant_name && (
                                    <span className="small text-danger">{errors.plant_name}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="plant_name"
                                size="sm"
                                id="plant_name"
                                maxLength="30" 
                                onChange={handleChange}
                                type="text"
                                value={values.plant_name}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                         
                        <CCol md={3}>
                            <CFormLabel htmlFor="plant_symbol">
                                Plant Symbol<REQ />{' '}
                                {errors.plant_symbol && (
                                    <span className="small text-danger">{errors.plant_symbol}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="plant_symbol"
                                size="sm"
                                id="plant_symbol"
                                maxLength="3" 
                                onChange={handleChange}
                                type="text"
                                value={values.plant_symbol}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>  

                        <CCol md={3}>
                            <CFormLabel htmlFor="plant_code">
                                Plant Code  
                            </CFormLabel>
                            <CFormInput
                                name="plant_code"
                                size="sm"
                                id="plant_code"
                                readOnly 
                                type="text"
                                value={latestLocationCodeFinder()} 
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="company_name">
                                Company Name <REQ />{' '}
                                {errors.company_name && (
                                    <span className="small text-danger">{errors.company_name}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="company_name"
                                size="sm"
                                id="company_name"
                                maxLength="30" 
                                onChange={handleChange}
                                type="text"
                                value={values.company_name}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="street_no">
                                Street Number <REQ />{' '}
                                {errors.street_no && (
                                    <span className="small text-danger">{errors.street_no}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="street_no"
                                size="sm"
                                id="street_no"
                                maxLength="30" 
                                onChange={handleChange}
                                type="text"
                                value={values.street_no}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="street_name">
                                Street Name <REQ />{' '}
                                {errors.street_name && (
                                    <span className="small text-danger">{errors.street_name}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="street_name"
                                size="sm"
                                id="street_name"
                                maxLength="30" 
                                onChange={handleChange}
                                type="text"
                                value={values.street_name}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="city">
                                City Name <REQ />{' '}
                                {errors.city && (
                                    <span className="small text-danger">{errors.city}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="city"
                                size="sm"
                                id="city"
                                maxLength="30" 
                                onChange={handleChange}
                                type="text"
                                value={values.city}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="state">
                                State <REQ />{' '}
                                {errors.state && (
                                    <span className="small text-danger">{errors.state}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="state"
                                size="sm"
                                id="state"
                                maxLength="20" 
                                onChange={handleChange}
                                type="text"
                                value={values.state}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="postal_code">
                                Postal Code <REQ />{' '}
                                {errors.postal_code && (
                                    <span className="small text-danger">{errors.postal_code}</span>
                                )}
                          </CFormLabel>
                          <CFormInput
                                name="postal_code"
                                size="sm"
                                id="postal_code"
                                maxLength="6" 
                                onChange={handleChange}
                                type="text"
                                value={values.postal_code}
                                onFocus={onFocus}
                                onBlur={onBlur}
                          />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="region">
                                Region Code <REQ />{' '}
                                {errors.region && (
                                    <span className="small text-danger">{errors.region}</span>
                                )}
                            </CFormLabel>
                            <CFormInput
                                name="region"
                                size="sm"
                                id="region"
                                maxLength="3" 
                                onChange={handleChange}
                                type="text"
                                value={values.region}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="gst_no">
                                GST Number
                            </CFormLabel>
                            <CFormInput
                                name="gst_no"
                                size="sm"
                                id="gst_no"
                                maxLength="20" 
                                onChange={handleChange}
                                type="text"
                                value={values.gst_no}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormLabel htmlFor="remarks">
                                Remarks                               
                            </CFormLabel>
                            <CFormInput
                                name="remarks"
                                size="sm"
                                maxLength={200}
                                id="remarks"
                                onChange={handleChange}
                                value={values.remarks}
                                onFocus={onFocus}
                                onBlur={onBlur} 
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
                            disabled={Object.keys(errors).length != 0 || allFieldsNotFilled()}
                            onClick={addNewPlant}
                          >
                            ADD
                          </CButton>
                          <Link to={'/FCIPlantMasterHome'}>
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
export default FCIPlantMaster
