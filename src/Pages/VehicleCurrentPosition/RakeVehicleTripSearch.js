import { 
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow, 
  CFormInput,
  CFormLabel, 
  CInputGroupText,
  CInputGroup, 
  CTabPane, 
  CTabContent,
  CNavItem,
  CNav,
  CNavLink, 
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader' 
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi' 
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent' 
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'  

const RakeVehicleTripSearch = () => {
  const REQ = () => <span className="text-danger"> * </span>

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = [] 
  const is_admin = (user_info.user_id == 1 && user_info.is_admin == 1) || (user_info.user_id == 26)

  if(is_admin){
    console.log(user_info)
  }

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate') 

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(true)
  let page_no = LogisticsProScreenNumberConstants.OtherModuleScreen.Vehicle_Current_Position

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

  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false) 

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5
      }}
    />
  )

  const [tripHirePaymentData, setTripHirePaymentData] = useState({})   
  const [tripSheetHaving, setTripsheetHaving] = useState(false) 
  const [activeKey, setActiveKey] = useState(1)

  const [tripsheetNumberNew, setTripsheetNumberNew] = useState('');
  const handleChangenewtrip = event => {
    let tripResult = event.target.value.toUpperCase();
    setTripsheetNumberNew(tripResult.trim());

  };

  const gettripHirePaymentData = (e) => {
    e.preventDefault()
    console.log(tripsheetNumberNew,'tripsheetNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumberNew) && /[a-zA-Z]/.test(tripsheetNumberNew) && /[0-9]/.test(tripsheetNumberNew)){
      TripSheetCreationService.getRAKETripsheetInfoByTripsheetNo(tripsheetNumberNew).then((res) => {
        setTripsheetHaving(true)
        console.log(res,'getRAKETripsheetInfoByTripsheetNo')
        if (res.status == 200 && res.data != '') {
          let needed_data = res.data.data
          setSmallFetch(true) 
          setTripHirePaymentData(needed_data)             
          toast.success('Tripsheet Details Detected!')
        } else {
          setTripHirePaymentData([])            
          setTripsheetHaving(false) 
          setSmallFetch(true)
          if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
            toast.warning(res.data.message)
          } else {
            setSmallFetch(true)
            toast.warning('Tripsheet Details cannot be detected from LP!')
          }
        }
      })
    } else {
      setTripHirePaymentData([]) 
      setTripsheetHaving(false)
      setSmallFetch(true) 
      toast.warning('Tripsheet Number Must Like "RAB123456789"')
      return false
    }

  }

  useEffect(() => {
    /* section for getting Pages List from database For Setting Permission */
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      console.log(response.data.data) 
      setFetch(true)
      setSmallFetch(true)
    })
  }, [])

  console.log(tripHirePaymentData,'tripHirePaymentData')

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CContainer className="mt-2">
                <CRow>
                  <CCol xs={12} md={4}>
                    <div className="w-100 p-3">
                      <CFormLabel htmlFor="tripsheetNumberNew">
                        Enter RAKE Tripsheet Number
                        <REQ />{' '}

                      </CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          size="sm"
                          name="tripsheetNumberNew"
                          id="tripsheetNumberNew"
                          maxLength={15}
                          autoComplete='off'
                          value={tripsheetNumberNew}
                          onChange={handleChangenewtrip}
                        />
                        <CInputGroupText className="p-0">
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={(e) => {
                              // setFetch(false)
                              setSmallFetch(false)
                              gettripHirePaymentData(e)
                            }}
                          >
                            <i className="fa fa-search px-1"></i>
                          </CButton>
                          <CButton
                            size="sm"
                            style={{ marginLeft:"3px",marginRight:"3px", }}
                            color="primary"
                            onClick={() => {
                              window.location.reload(false)
                            }}
                          >
                            <i className="fa fa-refresh px-1"></i>
                          </CButton>
                        </CInputGroupText>
                        {tripHirePaymentData.tripsheet_creation_plant_info && tripHirePaymentData.status == 2 ? ( 
                          <></>                           
                          ) : (  
                            <>
                            {tripHirePaymentData.tripsheet_creation_plant_info && tripHirePaymentData.status != 2 && (
                              <CButton
                                className="text-white"                              
                                color="success"
                                id={tripHirePaymentData.tripsheet_id} 
                                size="sm"
                              >
                                <span className="float-start">
                                <Link target='_blank' to={`/RAKETSCreationReport/${tripHirePaymentData.tripsheet_id}`}>
                                  <i className="fa fa-eye" style={{ color:"blue" }} aria-hidden="true"></i> &nbsp;
                                  <span style={{ color:"black" }}>Print </span>
                                </Link>
                                </span>
                              </CButton> 
                            )}
                          </>
                        )}
                      </CInputGroup>
                    </div>
                    
                  </CCol>
                </CRow>

                {!smallfetch && <SmallLoader />}

                {smallfetch && Object.keys(tripHirePaymentData).length != 0  && (

                  <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">
                    <CTabContent className="p-3">
                      <CTabPane role="tabpanel" aria-labelledby="home-tab">
                          
                      </CTabPane>
                    </CTabContent>
                  
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
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 2}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(2)}
                        >
                          Tripsheet Information
                        </CNavLink>
                      </CNavItem>

                    </CNav>

                     
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        <CRow className="mt-2">

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.vehicle_no} readOnly />
                          </CCol>  

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">FNR Number</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.fnr_no} readOnly />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Driver Name</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.driver_name} readOnly />
                          </CCol>  

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Driver Number</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.driver_phone_number} readOnly />
                          </CCol>  
                          {tripHirePaymentData.tripsheet_creation_plant_info && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vNum">Plant Name & Code</CFormLabel>
                              <CFormInput 
                                size="sm" 
                                id="vNum" 
                                value={`${tripHirePaymentData.tripsheet_creation_plant_info.definition_list_name} (${tripHirePaymentData.rake_plant_code})`}  
                                readOnly 
                              />
                            </CCol>
                          )}
                          {tripHirePaymentData.tripsheet_creation_vendor_info && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vNum">Vendor Name</CFormLabel>
                                <CFormInput 
                                  size="sm" 
                                  id="vNum" 
                                  value={tripHirePaymentData.tripsheet_creation_vendor_info.v_name}
                                  readOnly 
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vNum">Vendor Code</CFormLabel>
                                <CFormInput 
                                  size="sm" 
                                  id="vNum" 
                                  value={tripHirePaymentData.tripsheet_creation_vendor_info.v_code}
                                  readOnly 
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vNum">Vendor PAN Number</CFormLabel>
                                <CFormInput 
                                  size="sm" 
                                  id="vNum" 
                                  value={tripHirePaymentData.tripsheet_creation_vendor_info.v_pan_no}
                                  readOnly 
                                />
                              </CCol>
                            </>
                          )}

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Created Date</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.created_date} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Status</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.status == 1 ? 'Tripsheet Created' : (tripHirePaymentData.status == 2 ? 'Tripsheet Closed' : '--') } readOnly />
                          </CCol>
                         
                        
                        </CRow> 
                        
                      </CTabPane>
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={
                                tripHirePaymentData.rake_tripsheet_no ? tripHirePaymentData.rake_tripsheet_no : '-'
                              }
                              readOnly
                            />
                          </CCol>
                           
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">
                              Tripsheet Creation Date & Time
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TSCreationDateTime"
                              value={
                                tripHirePaymentData.created_at_format
                                  ? tripHirePaymentData.created_at_format
                                  : '---'
                              }
                              readOnly
                            />
                          </CCol>

                          {tripHirePaymentData.tripsheet_creation_user_info && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inspectionDateTime">
                                  Tripsheet Created By
                                </CFormLabel>
    
                                <CFormInput
                                  size="sm"
                                  id="TSCreationDateTime"
                                  value={`${tripHirePaymentData.tripsheet_creation_user_info.emp_name} (${tripHirePaymentData.tripsheet_creation_user_info.empid})`}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )} 
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">SAP Message</CFormLabel>  
                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.sap_message} readOnly />
                          </CCol>
                        </CRow>
                      </CTabPane>
                       
                    </CTabContent>                      
                  </CCard>  
                )}  
              </CContainer>
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default RakeVehicleTripSearch
