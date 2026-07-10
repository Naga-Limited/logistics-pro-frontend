import { React, useState,useEffect } from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CFormLabel,
  CWidgetStatsB,
  CInputGroup,
  CFormInput,
  CInputGroupText
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import DashboardService from 'src/Service/Dashboard/DashboardService'

const WidgetsDropdown = () => {

  const [tripsheetcountinfo, setTripsheetcountinfo] = useState(false)
useEffect(() => {
  DashboardService.getDashboardTripSheetDetails().then((res) => {
    console.log(res.data)
    setTripsheetcountinfo(res.data)
})
},[])

const [rowData, setRowData] = useState([])
const [pending, setPending] = useState(true)
const [own_shipment, setOwn_shipment] = useState(0)
const [overall_shipment, setOverall_shipment] = useState(0)
const [Hire_shipment, setHire_shipment] = useState(0)
const [Advance_Overall, setAdvance_Overall] = useState(0)
const [Advance_Own, setAdvance_Own] = useState(0)
const [Advance_Hire, setAdvance_Hire] = useState(0)
const [Diesel_Overall, setDiesel_Overall] = useState(0)
const [Diesel_Own, setDiesel_Own] = useState(0)
const [Diesel_Hire, setDiesel_Hire] = useState(0)
const [Tripclosure_Overall, setTripclosure_Overall] = useState(0)
const [Tripclosure_Own, setTripclosure_Own] = useState(0)
const [Tripclosure_Hire, setTripclosure_Hire] = useState(0)
const [TripSettle_Overall, setTripSettle_Overall] = useState(0)
const [TripSettle_Own, setTripSettle_Own] = useState(0)
const [TripSettle_Hire, setTripSettle_Hire] = useState(0)

let tableData = []
const Ownvehicle_shipment = () => {
  DashboardService.getDashboardOverAllDetails().then((res) => {
    tableData = res.data.data
    let rowDataList = []
    /*Shipment Own Vehicle */
    const ownshipment = tableData.filter(
      (data) =>
        (
          (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '18' && data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '1')||(data.vehicle_type_id.id != 3 && data.vehicle_current_position == '18' && parking_status == '11' && data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '2') || (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '18' && parking_status == '1' && data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '2')||(data.vehicle_type_id.id != 3 && data.vehicle_current_position == '20')||(data.vehicle_current_position == '21'))
    )
        /*Shipment Over All Vehicle */
    const overallshipment = tableData.filter(
      (data) =>
        (
          (data.vehicle_current_position == '18' && data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '1')||(data.vehicle_current_position == '18' && parking_status == '11' && data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '2') || (data.vehicle_current_position == '18' && parking_status == '1' && data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.to_divison == '2') || (data.vehicle_current_position == '16' && data.trip_sheet_info.purpose == '1')||(data.vehicle_current_position == '20')||(data.vehicle_current_position == '21'))
    )
    /*Shipment Hire Vehicle */
    const Hireshipment = tableData.filter(
      (data) =>
        (
          (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '16' && data.trip_sheet_info.purpose == '1')||(data.vehicle_type_id.id == 3 && data.vehicle_current_position == '20')||(data.vehicle_current_position == '21'))
    )
      /*Advance Over All Vehicle */
      const OverallAdvance = tableData.filter(
        (data) =>
          (
            (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '16'&& data.trip_sheet_info.purpose != '3' && data.trip_sheet_info.trip_advance_eligiblity == '1')|| (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '16'&& data.trip_sheet_info.purpose == '2' && data.trip_sheet_info.trip_advance_eligiblity == '1') || (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '22'&& data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.trip_advance_eligiblity == '1') ||(data.vehicle_type_id.id == 3 && data.vehicle_current_position == '25'&& data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.trip_advance_eligiblity == '1'))
      )
      /*Advance Own Vehicle */
      const OwnAdvance = tableData.filter(
        (data) =>
          (
            (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '16'&& data.trip_sheet_info.purpose != 3 && data.trip_sheet_info.trip_advance_eligiblity == '1'))
      )
       /*Advance Hire Vehicle */
       const HireAdvance = tableData.filter(
        (data) =>
          (
            ( (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '16' && data.trip_sheet_info.purpose == '2' &&data.trip_sheet_info.trip_advance_eligiblity == '1')||data.vehicle_type_id.id == 3 && data.vehicle_current_position == '22'&& data.trip_sheet_info.purpose == '1' && data.trip_sheet_info.trip_advance_eligiblity == '1') || (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '25' && data.trip_sheet_info.purpose == '1' &&data.trip_sheet_info.trip_advance_eligiblity == '1'))
      )
       /*Advance Over All Vehicle */
       const OverallDiesel = tableData.filter(
        (data) =>
          (
            (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '22')||(data.vehicle_type_id.id != 3 && data.vehicle_current_position == '25') || (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '18' && data.trip_sheet_info.purpose == '2') || (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '16' && data.parking_status == '8' &&data.trip_sheet_info.purpose == '3') || (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '18' && data.trip_sheet_info.purpose == '2' && data.advance_info.advance_payment_diesel !='0') || (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '22' && data.trip_sheet_info.purpose == '2' && data.advance_info.advance_payment_diesel !='0') ||(data.vehicle_type_id.id == 3 && data.vehicle_current_position == '25' && data.trip_sheet_info.purpose == '2' && data.advance_info.advance_payment_diesel !='0') || (data.vehicle_current_position == '37') || (data.vehicle_current_position == '39'))
      )
      const OwnDiesel = tableData.filter(
        (data) =>
          (
            (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '22')||(data.vehicle_type_id.id != 3 && data.vehicle_current_position == '25') || (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '18' && data.trip_sheet_info.purpose == '2') || (data.vehicle_type_id.id != 3 && data.vehicle_current_position == '16' && data.parking_status == '8' && data.trip_sheet_info.purpose == '3'))
      )
      const HireDiesel = tableData.filter(
        (data) =>
          (
             (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '18' && data.trip_sheet_info.purpose == '2' && data.advance_info.advance_payment_diesel !='0') || (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '22' && data.trip_sheet_info.purpose == '1' && data.advance_info.advance_payment_diesel !='0') ||(data.vehicle_type_id.id == 3 && data.vehicle_current_position == '25' && data.trip_sheet_info.purpose == '1' && data.advance_info.advance_payment_diesel !='0'))
      )
      const OverallTripClosure = tableData.filter(
        (data) =>
          ((data.vehicle_current_position == '16' && data.parking_status == '9' && data.trip_sheet_info.purpose == '3')||(data.vehicle_current_position == '16' && data.parking_status == '2' && data.trip_sheet_info.purpose == '3') ||
      (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '18'&& data.advance_info.advance_payment_diesel == null)  ||(data.vehicle_type_id.id == 3 && data.vehicle_current_position == '41')||(data.vehicle_type_id.id != 3 && data.vehicle_current_position == '41')
      ))
      const OwnTripClosure = tableData.filter(
        (data) =>
          ((data.vehicle_type_id.id != 3 && data.vehicle_current_position == '41')
      ))
      const HireTripClosure = tableData.filter(
        (data) =>
          ((data.vehicle_current_position == '16' && data.parking_status == '9' && data.trip_sheet_info.purpose == '3')||(data.vehicle_current_position == '16' && data.parking_status == '2' && data.trip_sheet_info.purpose == '3') ||
          (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '18'&& data.advance_info.advance_payment_diesel == null)  || (data.vehicle_type_id.id == 3 && data.vehicle_current_position == '41')
      ))
      const OverallTripSettlement = tableData.filter(
        (data) =>
          (data.vehicle_current_position =='26'))
      const OwnTripSettlement = tableData.filter(
        (data) =>
          (data.vehicle_type_id !='3' && data.vehicle_current_position =='26'))
      const HireTripSettlement = tableData.filter(
        (data) =>
          (data.vehicle_type_id == '3' && data.vehicle_current_position =='26'))

    ownshipment.map(() => {
      setOwn_shipment(ownshipment.length)
    })
    overallshipment.map(() => {
      setOverall_shipment(overallshipment.length)
    })
    Hireshipment.map(() => {
      setHire_shipment(Hireshipment.length)
    })
    OverallAdvance.map(() => {
      setAdvance_Overall(OverallAdvance.length)
    })
    OwnAdvance.map(() => {
      setAdvance_Own(OwnAdvance.length)
    })
    HireAdvance.map(() => {
      setAdvance_Hire(HireAdvance.length)
    })
    OverallDiesel.map(() => {
      setDiesel_Overall(OverallDiesel.length)
    })
    OwnDiesel.map(() => {
      setDiesel_Own(OwnDiesel.length)
    })
    HireDiesel.map(() => {
      setDiesel_Hire(HireDiesel.length)
    })
    OverallTripClosure.map(() => {
      setTripclosure_Overall(OverallTripClosure.length)
    })
    OwnTripClosure.map(() => {
      setTripclosure_Own(OwnTripClosure.length)
    })
    HireTripClosure.map(() => {
      setTripclosure_Hire(HireTripClosure.length)
    })
    OverallTripSettlement.map(() => {
      setTripSettle_Overall(OverallTripSettlement.length)
    })
    OwnTripSettlement.map(() => {
      setTripSettle_Own(OwnTripSettlement.length)
    })
    HireTripSettlement.map(() => {
      setTripSettle_Hire(HireTripSettlement.length)
    })
    setRowData(rowDataList)
    setPending(false)
  })
}

useEffect(() => {
  Ownvehicle_shipment();
})

  return (
    <CRow>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-1"
          color="primary"
          style={{paddingBottom:15}}
          value={
            <>
            <div>
            <CInputGroup style={{color:'white'}}>
            <CInputGroupText style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}>
            TripSheet Open Count -
            <CFormInput value={tripsheetcountinfo.Tripsheet_Waiting_Open_Count} style={{color:'white',backgroundColor:'#4d3227',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={tripsheetcountinfo.Tripsheet_Own_Count} style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={tripsheetcountinfo.Tripsheet_Hire_Count} style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            </div>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-1"
          color="info"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup className="bg-info text-dark" >
            <CInputGroupText className="bg-info text-dark" style={{borderColor:'black'}}>
            Shipment Open Count -
            <CFormInput readOnly value={overall_shipment} className="bg-info text-dark"style={{border:'hidden'}} />
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText className="bg-info text-dark" style={{
                            width: '75%',borderColor:'black'
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={own_shipment}className="bg-info text-dark"style={{borderColor:'black'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText className="bg-info text-dark" style={{width: '75%',borderColor:'black'}}>Hire</CInputGroupText><CFormInput readOnly value={Hire_shipment} className="bg-info text-dark"style={{borderColor:'black'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup style={{color:'white'}}>
            <CInputGroupText style={{
                    backgroundColor: 'dodgerblue',
                    color: 'white',
                  }}>
            Advance Open Count -
            <CFormInput readOnly value={Advance_Overall} style={{color:'white',backgroundColor:'dodgerblue',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: 'dodgerblue',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={Advance_Own} style={{color:'white',backgroundColor:'dodgerblue'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: 'dodgerblue',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={Advance_Hire} style={{color:'white',backgroundColor:'dodgerblue'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-2 bg-danger text-white gradient"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup  className="bg-danger text-white gradient" style={{color:'white'}}>
            <CInputGroupText  className="bg-danger text-white gradient" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}>
            Diesel Intent -
            <CFormInput readOnly value={Diesel_Overall}  className="bg-danger text-white gradient" style={{color:'white',backgroundColor:'#4d3227',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-danger text-white gradient" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={Diesel_Own}  className="bg-danger text-white gradient" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-danger text-white gradient" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={Diesel_Hire}  className="bg-danger text-white gradient" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          // className="mb-2 bg-yellow text-white"
          style={{paddingBottom:15,backgroundColor: '#ffa500'}}
          value={
            <>
            <CInputGroup  style={{color:'white'}}>
            <CInputGroupText  className="bg-yellow text-white" style={{
                    backgroundColor: ' #ffa500',
                    color: 'white',
                  }}>
            Trip Closure -
            <CFormInput readOnly value={Tripclosure_Overall} style={{color:'white',backgroundColor:'#ffa500',border:'#ffa500'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#ffa500',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={Tripclosure_Own} style={{color:'white',backgroundColor:'#ffa500'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#ffa500',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={Tripclosure_Hire} style={{color:'white',backgroundColor:'#ffa500'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-2 bg-success text-white"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup  className="bg-success text-white" style={{color:'white'}}>
            <CInputGroupText  className="bg-success text-white" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}>
            Trip Settlement -
            <CFormInput readOnly value={TripSettle_Overall}  className="bg-success text-white" style={{color:'white',backgroundColor:'#4d3227',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-success text-white" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={TripSettle_Own}  className="bg-success text-white" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-success text-white" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={TripSettle_Hire}  className="bg-success text-white" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
