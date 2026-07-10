import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer, 
} from '@coreui/react' 
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable' 
import Loader from 'src/components/Loader' 
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes' 
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods' 
import NlmtTSFreightUpdationService from 'src/Service/Nlmt/FreightUpdation/NlmtTSFreightUpdationService'

const NlmtFreightUpdationApprovalHome = () => { 

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Trip_Sheet_Freight_Updation_Approval_Info_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([]) 
  const [fetch, setFetch] = useState(false)  
  let tableReportData = []

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

   /*================== User Location Fetch ======================*/
   const user_info_json = localStorage.getItem('user_info')
   const user_info = JSON.parse(user_info_json)
   var user_locations = []

   /* Get User Locations From Local Storage */
   user_info.location_info.map((data, index) => {
     user_locations.push(data.id)
   })

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Freight_Updation_Approval

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

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  const loadTripShipmentReport = (fresh_type = '') => {

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      NlmtTSFreightUpdationService.getFreightUpdationApprovalData().then((res) => {
        tableReportData = res.data.data
        console.log(tableReportData,'getFreightUpdationApprovalData-tableReportData')
        setFetch(true)
        let rowDataList = []
        let filterData1 = tableReportData
        const filterData = (filterData1).filter((data) => data.parking_yard_info && data.trip_vehicle_info ) 
        console.log(filterData,'getFreightUpdationApprovalData-filterData')
        filterData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Tripsheet_No: data.nlmt_tripsheet_no,
            Creation_Date: formatDate(data.created_at), 
            Vehicle_No: data.trip_vehicle_info.vehicle_number,              
            Driver_Name: data.parking_yard_info.driver_name,
            Driver_Mobile_Number: data.parking_yard_info.driver_phone_1, 
            Vendor_Code: data.parking_yard_info && data.parking_yard_info.vendor_info && data.parking_yard_info.vendor_info.vendor_code ? data.parking_yard_info.vendor_info.vendor_code : '-',
            Vendor_Name: data.parking_yard_info && data.parking_yard_info.vendor_info && data.parking_yard_info.vendor_info.owner_name ? data.parking_yard_info.vendor_info.owner_name : '-',
            Vendor_Mobile_No: data.parking_yard_info && data.parking_yard_info.vendor_info && data.parking_yard_info.vendor_info.owner_number ? data.parking_yard_info.vendor_info.owner_number : '-', 
            Shed_Name: data.parking_yard_info && data.parking_yard_info.vendor_info && data.parking_yard_info.vendor_info.shed_info && data.parking_yard_info.vendor_info.shed_info.shed_name ? data.parking_yard_info.vendor_info.shed_info.shed_name : '-', 
            Shed_Mobile_No: data.parking_yard_info && data.parking_yard_info.vendor_info && data.parking_yard_info.vendor_info.shed_info && data.parking_yard_info.vendor_info.shed_info.shed_owner_phone_1 ? data.parking_yard_info.vendor_info.shed_info.shed_owner_phone_1 : '-',  
            Remarks: data.remarks,
            Route: data.trip_vehicle_route && data.trip_vehicle_route.route_name ? data.trip_vehicle_route.route_name : '-',
            Trip_Freight_Rate: data.trip_freight_rate ? data.trip_freight_rate : '-',
            Trip_Updated_Freight_Rate: data.trip_updated_freight_rate ? data.trip_updated_freight_rate : '-',  

            Action: (
              <CButton className="badge" color="warning">
                <Link className="text-white" to={`${data.nlmt_tripsheet_id}`}>Freight Approval</Link>
              </CButton>
            ),
          })
        })
        setRowData(rowDataList) 
      })
    }

  }

  useEffect(() => {
    loadTripShipmentReport()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Route',
      selector: (row) => row.Route,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contact No',
      selector: (row) => row.Driver_Mobile_Number,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight',
      selector: (row) => row.Trip_Freight_Rate,
      sortable: true,
      center: true,
    },
    {
      name: 'Updation',
      selector: (row) => row.Trip_Updated_Freight_Rate,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>

        {screenAccess ? (
         <>
          <CCard className="mt-4">
            <CContainer className="m-2">
              <CRow>
                <CCol
                  className="offset-md-9"
                  xs={12}
                  sm={12}
                  md={3}
                style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                    size="lg-sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    onClick={(e) => {
                      exportToCSV()}
                      }>
                    Export
                    </CButton>
                </CCol>
              </CRow>
              <CustomTable
                columns={columns}
                data={rowData}
                // fieldName={'Driver_Name'}
                showSearchFilter={true}
              />
            </CContainer>
          </CCard>
         </>
	      ) : (<AccessDeniedComponent />)}
   	   </>
      )}
    </>
  )
}

export default NlmtFreightUpdationApprovalHome
