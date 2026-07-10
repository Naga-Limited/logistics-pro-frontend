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
  CTabPane
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DepoVehicleValidation from 'src/Utils/Depo/Vehicle/DepoVehicleValidation'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DepoRouteMasterService from 'src/Service/Depo/Master/DepoRouteMasterService'

const DepoRouteMasterEdit = () => {
  const { id } = useParams()

  const formValues = {
      vehicleNumber: '',
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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Route_Master

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
    const [locationData, setLocationData] = useState([])
    const [locationName, setLocationName] = useState('')

    const [routeName, setRouteName] = useState('')
    const handleChangeRemarks = (event) => {
      const result = event.target.value.toUpperCase()
      console.log('value.routename', routeName)
      setRouteName(result)
    }
    const [singleRouteInfo, setSingleRouteInfo] = useState([])


    const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
      addNewRoute,
      DepoVehicleValidation,
      formValues
    )

    useEffect(() => {
      //section for getting Location Data from database
      LocationApi.getLocation().then((res) => {
        setLocationData(res.data.data)
      })

    }, [])

  function addNewRoute() {

    console.log(locationName)
    if (locationName == '' || locationName == '0') {
      toast.warning('Location Required')
      return false
    }

    if (routeName.trim() == '') {
      toast.warning('Route Required')
      routeName = ''
      return false
    }

    if (routeName.trim() && !/^[a-zA-Z ]+$/.test(routeName)) {
      toast.warning('Route Name Should only have Letters and Space')
      return false
    }

    setFetch(false)

    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('location_id', locationName)
    formData.append('route_name', routeName)
    formData.append('updated_by', user_id)

    console.log(values)

    DepoRouteMasterService.updateDepoRoutes(id, formData).then((res) => {

      setFetch(true)
      if (res.status === 200) {

        toast.success('Depo Route Updated Successfully!')
        setTimeout(() => {
          navigation('/DepoRouteMasterTable')
        }, 1000)

      } else if (res.status == 202) {

        toast.warning('Route Already Exists..!')
        setTimeout(() => {
          window.location.reload(false)
        }, 1000)
      }
    })
    .catch((error) => {
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

  const onChangeFilter = (event) => {
    var selected_value = event.target.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setLocationName(selected_value)
    } else {
      setLocationName('')
    }
  }

  useEffect(() => {

    //section to fetch single Route info
    DepoRouteMasterService.getDepoRouteById(id).then((res) => {
      setFetch(true)
      let route_data = res.data.data
      console.log(res.data.data,'Routes info')
      setLocationName(route_data.location_info.id)
      setRouteName(route_data.route_name)
      setSingleRouteInfo(route_data)
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
                          <CFormLabel htmlFor="depoLocation">
                            Depo Location <REQ />{' '}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="depoLocation"
                            id="depoLocation"
                            onFocus={onFocus}
                            onClick={(e) => {
                              onChangeFilter(e)
                            }}
                            value={locationName}
                            aria-label="Small select example"
                          >
                            <option value="0">Select ...</option>

                            {locationData.map(({ id, location }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {location}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>

                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="routeName">
                            Route Name <REQ />{' '}
                            {errors.routeName && (
                              <span className="small text-danger">{errors.routeName}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="routeName"
                            size="sm"
                            maxLength={30}
                            id="routeName"
                            value={routeName}
                            onChange={handleChangeRemarks}
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
                            onClick={(event) => {
                              event.preventDefault()
                              addNewRoute()
                            }}
                          >
                            UPDATE
                          </CButton>
                          <Link to={'/DepoRouteMasterTable'}>
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

export default DepoRouteMasterEdit
