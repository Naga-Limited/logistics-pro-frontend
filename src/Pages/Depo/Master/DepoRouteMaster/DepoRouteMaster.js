/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoVehicleValidation from 'src/Utils/Depo/Vehicle/DepoVehicleValidation'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DepoRouteMasterService from 'src/Service/Depo/Master/DepoRouteMasterService'

const DepoRouteMaster = () => {
  const formValues = {
    routeName: ''
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
  const [locationData, setLocationData] = useState([])
  const [locationName, setLocationName] = useState('')

  const [routeName, setRouteName] = useState('')
  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    console.log('value.routename', routeName)
    setRouteName(result)
  }

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewRoute,
    DepoVehicleValidation,
    formValues
  )

  useEffect(() => {
    setFetch(true)
    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data)
    })

  }, [])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setLocationName(selected_value)
    } else {
      setLocationName('')
    }
  }

  function addNewRoute() {

    if (locationName == '') {
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
    formData.append('location_id', locationName)
    formData.append('route_name', routeName)
    formData.append('created_by', user_id)

    DepoRouteMasterService.createDepoRoute(formData).then((res) => {

      if (res.status == 201) {
        setFetch(true)
        toast.success('Route Created Successfully!')

        setTimeout(() => {
          navigation('/DepoRouteMasterTable')
        }, 1000)

      } else if (res.status == 202) {
        setFetch(true)
        toast.success('Route Already Exists..!')

        setTimeout(() => {
          window.location.reload(false)
        }, 1000)
      }
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
                    <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                      <CRow className="mb-md-1">
                        <CCol md={3}>
                          <CFormLabel htmlFor="depoContractorName">
                            Depo Location <REQ />{' '}

                          </CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e)
                              {
                                handleChange
                              }
                            }}
                            label="Select Location Name"
                            noOptionsMessage="Location Not found"
                            search_type="depo_routes"
                            search_data={locationData}
                          />
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
                            onClick={() => {
                              event.preventDefault()
                              addNewRoute()
                            }}

                          >
                            ADD
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
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoRouteMaster
