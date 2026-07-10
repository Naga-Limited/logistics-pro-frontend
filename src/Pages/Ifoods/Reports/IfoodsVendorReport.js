import { CButton, CCard, CContainer, CCol, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import { GetDateTimeFormat } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';


const IfoodsVendorReport = () => {
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [locationData, setLocationData] = useState([])
  let viewData

  function changeVendorStatus(id) {
    IfoodsVendorMasterService.deleteIfoodsVendors(id).then((res) => {
      toast.success('Vendor Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Vendor_Master

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Ifoods_Vendor_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const vendorLocationFinder = (data) => {
    let location = ''
    if (data) {
      let needed_data = locationData.filter((c, index) => {
        if (c.id == data) {
          return true
        }
      })

      location = needed_data[0] ? needed_data[0].location : 'Loading..'

      return location
    }
    return location
  }
  useEffect(() => {
    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data, 'location data')
      setLocationData(res.data.data)
    })
  }, [])

  useEffect(() => {
    IfoodsVendorMasterService.getIfoodsVendors().then((response) => {
      setFetch(true)
      viewData = response.data.data
      console.log(viewData, 'route_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          vendor_code: data.vendor_code,
          vendor_name: data.vendor_name,
          vendor_contact_no: data.vendor_contact_no,
          //Location_id: vendorLocationFinder(data.location_id),
          Location_id: data.location_info
          .filter((location) => location.location_name)
          .map((location) => `${location.location_name} - ${location.location_code}`)
          .join(', '),
          freight_type: data.freight_type === 1 ? 'Budget' : 'Actual',
          tds_tax_type: data.tds_tax_type,
      
          Status: data.vendor_status === 1 ? 'Active' : 'In-Active',
          
        })
      })
      setRowData(rowDataList)
    })
  }, [locationData])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Created At',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.vendor_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contact No',
      selector: (row) => row.vendor_contact_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Type',
      selector: (row) => row.freight_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Location',
      selector: (row) => row.Location_id,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
    
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <CButton
                        size="lg-sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        onClick={(e) => {
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
                </CContainer>
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default IfoodsVendorReport
