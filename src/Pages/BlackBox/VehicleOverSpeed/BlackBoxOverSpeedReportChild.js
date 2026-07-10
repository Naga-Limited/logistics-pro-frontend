
/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CFormInput,
  CFormLabel, 
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter, 
  CAlert, 
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react' 
import { Link, useNavigate, useParams } from 'react-router-dom' 
import Loader from 'src/components/Loader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure'; 
import BlackBoxService from 'src/Service/BlackBox/BlackBoxService';
import CustomTable from 'src/components/customComponent/CustomTable'; 
  
const BlackBoxOverSpeedReportChild = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const [assignMigoModal, setAssignMigoModal] = useState(false)
  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false) 
  let page_no = LogisticsProScreenNumberConstants.BlackBoxVehicleReportModule.Vehicle_Over_Speed

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

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: ''
  }

  const {
    values,
    errors,
    handleChange,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
  } = useFormDepoExpenseClosure(login, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  const { id } = useParams()
  const [fetch, setFetch] = useState(false)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [displayVehicleNo, setDisplayVehicleNo] = useState('')
  const [displayVehicleInfo, setDisplayVehicleInfo] = useState({})
  const [displayVehicleOSCount, setDisplayVehicleOSCount] = useState('')

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  );

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [rowData, setRowData] = useState([])
  const [displayVehicleData, setDisplayVehicleData] = useState([])

  const [expenseClosureData, setExpenseClosureData] = useState([])

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  const assignVehicleInfo = (vdata,vno) => {

      console.log(vdata,'vdata')
      console.log(vno,'vno')
      let rowDataList = []

      const filterData = vdata.filter( 
          (data) => data.VehicleName == vno
        )
        console.log(filterData,'filterData')
      let needed_data = filterData[0].drOverSpeedSubLst
        
        console.log(needed_data,'needed_data')
        needed_data.map((data, index) => { 
          rowDataList.push({
            sno: index + 1,
            DriverName: data.DriverName,
            vehicle_speed: data.Speed,
            time: data.stDate,
            lattitude: data.Latitude,
            longiitude: data.Longitude,   
            Map_Url: (
              <CTooltip
                content={data.Location}
                placement="top"
              >
                <CButton className="btn btn-success btn-sm me-md-1">
                  <a style={{color:'black'}} target='_blank' rel="noreferrer" href={`http://www.google.com/maps/place/${data.Latitude},${data.Longitude}`}>
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                  </a>
                </CButton>
              </CTooltip>
            ),         
          })
          
        })
        setDisplayVehicleData(rowDataList)
  }

  const columns_child = [
      {
          name: 'S.No',
          selector: (row) => row.sno,
          sortable: true,
          center: true,
      },
      {
          name: 'Driver Name',
          selector: (row) => row.DriverName,
          sortable: true,
          center: true,
      },
      {
          name: 'Vehicle Speed',
          selector: (row) => row.vehicle_speed,
          sortable: true,
          center: true,
      },
      {
          name: 'Time',
          selector: (row) => row.time,
          sortable: true,
          center: true,
      },
      {
          name: 'Lattitude',
          selector: (row) => row.lattitude,
          sortable: true,
          center: true,
      },
      {
          name: 'Longiitude',
          selector: (row) => row.longiitude,
          sortable: true,
          center: true,
      },
      {
        name: 'Location',
        selector: (row) => row.Map_Url,
        center: true,
      },
  ]

  useEffect(() => {

      BlackBoxService.getVOSInfoById(id).then((res) => {
        setFetch(true)
        let rowDataList = []
        let closure_info_data = res.data.data
        console.log(closure_info_data,'closure_info_data')
        let vehicle_info_data = closure_info_data.vehicle_info ? closure_info_data.vehicle_info : []
        vehicle_info_data.map((data, index) => { 
          rowDataList.push({
            sno: index + 1,
            vehicle_no: data.vehicle_no,
            current_speed: data.current_speed,
            over_speed_count: data.over_speed_count, 
            Action: (
              <>
                  <CButton 
                      className="btn btn-sm me-md-1" 
                      color={data.over_speed_count == 0 ? 'danger' : 'success'}
                      disabled={data.over_speed_count==0}
                      onClick={() => {
                          setAssignMigoModal(true)
                          setDisplayVehicleNo(data.vehicle_no)
                          setDisplayVehicleOSCount(data.over_speed_count)
                          setDisplayVehicleInfo(data.vehicle_info)
                          assignVehicleInfo(closure_info_data.json_data,data.vehicle_no)
                          // setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                      }}
                  >
                  {/* <Link className="text-white" target='_blank' to={`/BlackBoxOverSpeedReport/${data.id}`}> */}
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  {/* </Link> */}
                </CButton>                
              </>
            ),           
          })
            
          
        })
        setRowData(rowDataList)
        setExpenseClosureData(closure_info_data)
      })


  }, [id])

  const GetTimeFormat = (tre) => {
      let time = new Date(tre).toLocaleTimeString()
      return time
    }

      
    const columns = [
      {
        name: 'S.No',
        selector: (row) => row.sno,
        sortable: true,
        center: true,
      },
      {
        name: 'Vehicle Number',
        selector: (row) => row.vehicle_no,
        sortable: true,
        center: true,
      },     
      {
        name: 'vehicle Speed',
        selector: (row) => row.current_speed,
        sortable: true,
        center: true,
      },
      {
        name: 'Over Speed Count',
        selector: (row) => row.over_speed_count,
        sortable: true,
        center: true,
      }, 
      {
        name: 'View',
        selector: (row) => row.Action,
        center: true,
      },
    ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">
                <CTabContent className="p-3">
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={mainKey === 1}>
                    {/* Hire Vehicles Part Header Tab Start */}
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(1)}
                        >
                          General Information
                        </CNavLink>
                      </CNavItem>
                     
                    </CNav>
                    {/* Hire Vehicles Part Header Tab End */}
                    {/* Hire Vehicles Part Start */}
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        {/* Hire Vehicle General Info Part Start */}
                        {expenseClosureData && (
                          <CRow className="">
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Capture Date</CFormLabel>
                              <CFormInput
                                name="cname"
                                size="sm"
                                id="cname"
                                value={expenseClosureData.created_date}
                                readOnly
                              />
                            </CCol> 
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">From Time</CFormLabel>
                              <CFormInput
                                name="cname"
                                size="sm"
                                id="cname"
                                value={GetTimeFormat(expenseClosureData.from_date_time)}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">To Time</CFormLabel>
                              <CFormInput
                                name="cname"
                                size="sm"
                                id="cname"
                                value={GetTimeFormat(expenseClosureData.to_date_time)}
                                readOnly
                              />
                            </CCol> 
                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Total Vehicles</CFormLabel>
                              <CFormInput
                                name="cname"
                                size="sm"
                                id="cname"
                                value={expenseClosureData.record_count}
                                readOnly
                              />
                            </CCol>                              
                          </CRow>
                        )}
                        <CustomTable
                          columns={columns}
                          data={rowData}
                          fieldName={'Driver_Name'}
                          showSearchFilter={true}
                        />
                        <CRow className="mb-md-1">
                          <CCol
                            className="pull-right"
                            xs={12}
                            sm={12}
                            md={12} 
                          > 
                            <Link to={'/BlackBoxOverSpeedReportScreen'}>
                              <CButton
                                size="s-lg"
                                color="primary"
                                className="mx-1 px-2 text-white"
                                type="button"
                              >
                                {`<-- Previous`}
                              </CButton>
                            </Link>
                          </CCol>
                        </CRow>
                      </CTabPane>
                      {/* Hire Vehicle General Info Part End */}                    
                       
                    </CTabContent>
                    {/* <CRow className="mt-2">
                      <CCol>
                        <Link to={'/DepoSettlementApprovalTable'}>
                          <CButton
                            md={9}
                            size="sm"
                            color="primary"
                            disabled=""
                            className="text-white"
                            type="button"
                          >
                            Previous
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow> */}
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

                {/* ============== Income Reject Confirm Button Modal Area ================= */}
                
                  <CModal
                    size="xl" 
                    backdrop="static"
                    scrollable
                    visible={assignMigoModal}
                    onClose={() => {
                        setAssignMigoModal(false) 
                        setDisplayVehicleNo('')
                        setDisplayVehicleOSCount('')
                        setDisplayVehicleInfo({})
                    }}
                  >
                  <CModalHeader>
                      <CModalTitle>{`Vehicle No : ${displayVehicleNo}, Over Speed Count : ${displayVehicleOSCount}`}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                        
                      <CustomTable
                        columns={columns_child}
                        data={displayVehicleData}
                        fieldName={'Driver_Name'}
                        showSearchFilter={true}
                      />
                      
                  </CModalBody>
                  <CModalFooter>
                        
                      <CButton
                      color="primary"
                      onClick={() => {
                        setAssignMigoModal(false)
                        setDisplayVehicleNo('')
                        setDisplayVehicleOSCount('')
                        setDisplayVehicleInfo({})
                        // setOtherExpenses('')
                      }}
                      >
                      Close
                      </CButton>
                  </CModalFooter>
              </CModal>
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}
  
  export default BlackBoxOverSpeedReportChild
  
  
  