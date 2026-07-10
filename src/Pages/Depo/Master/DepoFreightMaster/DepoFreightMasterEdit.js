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
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import DepoFreightMasterService from 'src/Service/Depo/Master/DepoFreightMasterService'
import { getCurrentDateTime } from '../../CommonMethods/CommonMethods'

const DepoFreightMasterEdit = () => {

  const { id } = useParams()

  const formValues = {
    freightRate: '',
    routeName: '',
    contractorName: '',
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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Freight_Master

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
  const [singleFreightInfo, setSingleFreightInfo] = useState([])
  const [contractorData, setContractorData] = useState([])
  const [contractorId, setContractorId] = useState('')
  const [routeData, setRouteData] = useState([])
  const [routeId, setRouteId] = useState('')
  const [locationName, setLocationName] = useState('')
  const [freightRate, setFreightRate] = useState('')
  const [remarks, setRemarks] = useState('')

  const handleChangeRemarks = (value) => {
    const result = value.trim()
    console.log('value.routename', freightRate)
    setFreightRate(result)
  }

  const handleChangeRemarks1 = (value) => {
    const result = value.trim()
    console.log('value.remarks', remarks)
    setRemarks(result)
  }

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewFreight,
    DepoVehicleValidation,
    formValues
  )

  useEffect(() => {
    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data)
    })

  }, [])

  useEffect(() => {

    //section to fetch single Route info
    DepoFreightMasterService.getDepoFreightById(id).then((res) => {
      setFetch(true)
      let route_data = res.data.data
      console.log(res.data.data,'Freights info')
      setLocationName(route_data.location_info.id)
      setRouteId(route_data.route_id)
      setContractorId(route_data.contractor_id)
      setFreightRate(route_data.freight_rate)
      setRemarks(route_data.remarks)
      setSingleFreightInfo(route_data)
    })

  }, [id])

  const onChangeFilter = (value) => {
    var selected_value = value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setLocationName(selected_value)
    } else {
      setLocationName('')
    }
  }

  const onChangeRouteFilter = (value) => {
    var selected_route_value = value
    if (selected_route_value) {
      setRouteId(selected_route_value)
    } else {
      setRouteId('')
    }
  }


  const onChangeContractorFilter = (value) => {
    var selected_contractor_value = value
    if (selected_contractor_value) {
      setContractorId(selected_contractor_value)
    } else {
      setContractorId('')
    }
  }

  useEffect(() => {

    if(locationName) {

      //section to fetch Routes by Depo Location Id
      DepoRouteMasterService.getDepoRoutesByDepoLocationId(locationName).then((res) => {
        console.log(res.data.data,'getDepoRoutesByDepoLocationId')
        setRouteData(res.data.data)
      })

      //section to fetch Contractors by Depo Location Id
      DepoRouteMasterService.getDepoContractorsByDepoLocationId(locationName).then((res) => {
        console.log(res.data.data,'getDepoContractorsByDepoLocationId')
        setContractorData(res.data.data)
      })

    } else {
      setRouteData([])
      setContractorData([])
    }


  }, [locationName])

  const getOldLogInfo = () => {
    let data = [] 
    let temp = singleFreightInfo.log_info ? JSON.parse(singleFreightInfo.log_info) : []
    console.log(temp,'getOldLogInfo') 
    temp.map((vk,kk)=>{
      data[kk] = vk 
    }) 
    console.log(data,'getOldLogInfo-data')
    return data
  }

  function addNewFreight() {

    if (locationName == '') {
      toast.warning('Location Required')
      return false
    }

    if (routeId == '') {
      toast.warning('Route Name Required')
      return false
    }

    if (contractorId == '') {
      toast.warning('Contractor Name Required')
      return false
    }

    if (freightRate.trim() == '') {
      toast.warning('Freight Rate Required')
      setFreightRate('')
      return false
    }

    if (!/^[\d]{1,4}\.[\d]{2}$/.test(freightRate.trim())) {
      toast.warning('Freight Rate Format Should be as 95.60')
      return false
    }

    setFetch(false)

    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('location_id', locationName)
    formData.append('route_id', routeId)
    formData.append('contractor_id', contractorId)
    formData.append('freight_rate', freightRate)
    formData.append('updated_by', user_id)

    formData.append('remarks', remarks)
    formData.append('created_by', user_id)
    console.log(formData,'formData')
    
    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo()
    current_info.push({
      location_id: locationName,
      route_id: routeId,
      contractor_id: contractorId,
      freight_rate: freightRate, 
      type: 2, /* Updation */
      user: user_id,
      time: current_time,
      remarks: remarks,
    })
    formData.append('log_info', JSON.stringify(current_info))
    // return false
    DepoFreightMasterService.updateFreights(id, formData).then((res) => {

      if (res.status == 200) {
        setFetch(true)
        toast.success('Freight Updated Successfully!')

        setTimeout(() => {
          navigation('/DepoFreightMasterTable')
        }, 1000)

      } else if (res.status == 202) {
        setFetch(true)
        toast.warning('Freight Already Exists..!')

        // setTimeout(() => {
        //   window.location.reload(false)
        // }, 1000)
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
                          <CFormLabel htmlFor="depoLocation">
                            Depo Location <REQ />{' '}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="depoLocation"
                            id="depoLocation"
                            onFocus={onFocus}
                            onChange={(e) => onChangeFilter(e.target.value)}
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
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="routeName"
                            id="routeName"
                            onFocus={onFocus}
                            onChange={(e) => onChangeRouteFilter(e.target.value)}
                            value={routeId}
                            aria-label="Small select example"
                          >
                            <option value="">Select ...</option>

                            {routeData.map(({ id, route_name }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {route_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>

                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorName">
                            Contractor Name <REQ />{' '}
                          </CFormLabel>

                          <CFormSelect
                            size="sm"
                            name="contractorName"
                            id="contractorName"
                            onFocus={onFocus}
                            onChange={(e) => onChangeContractorFilter(e.target.value)}
                            value={contractorId}
                            aria-label="Small select example"
                          >
                            <option value="">Select ...</option>

                            {contractorData.map(({ id, contractor_name }) => {
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {contractor_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>

                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="freightRate">
                            Freight Rate <REQ />{' '}

                          </CFormLabel>
                          <CFormInput
                            name="freightRate"
                            size="sm"
                            maxLength={30}
                            id="freightRate"
                            value={freightRate}
                            onChange={(e) => handleChangeRemarks(e.target.value)}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="remarks">
                            Remarks 

                          </CFormLabel>
                          <CFormInput
                            name="remarks"
                            size="sm"
                            // maxLength={30}
                            id="remarks"
                            value={remarks}
                            onChange={(e) => handleChangeRemarks1(e.target.value)}
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
                              addNewFreight()
                            }}

                          >
                            Update
                          </CButton>
                          <Link to={'/DepoFreightMasterTable'}>
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

export default DepoFreightMasterEdit
