import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FCIPlantMasterTable = () => {

    const [fetch, setFetch] = useState(false)
    const [rowData, setRowData] = useState([])
    const [mount, setMount] = useState(1) 
    let viewData = []

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

    const changeLocationStatus = (deleteId) => {
        console.log(deleteId,'deleteId') 
        FCIPlantMasterService.deleteFCIPlantRequestTableData(deleteId).then((response) => {
        setFetch(true) 
        if (response.status === 204) { 
            toast.success('Plant List Status Updated Successfully!')
            setMount((preState) => preState + 1) 
        }
        })    
    }

    useEffect(()=>{

        /* section for getting FCI Plant Master List For Plant Name Display from database */
        FCIPlantMasterService.getFCIPlantRequestTableData().then((response) => {
            console.log(response.data.data,'FCI Plant Master List')
            setFetch(true)
            viewData = response.data.data
            console.log(viewData,'Plant_data')
            let rowDataList = []
            viewData.map((data, index) => {
                rowDataList.push({
                sno: index + 1,
                Creation_Date: data.created_date,
                Plant_Code: data.plant_code,
                Plant_Name: data.plant_name, 
                Plant_Symbol: data.plant_symbol, 
                Status: data.plant_status == 1 ? '✔️' : '❌',
                Action: (
                    <div className="d-flex justify-content-space-between">
                    <CButton
                        size="sm"
                        color={data.plant_status == 1 ? "success" : "danger"}
                        shape="rounded"
                        id={data.plant_id}
                        onClick={() => { 
                        setFetch(false)
                        changeLocationStatus(data.plant_id) 
                        }}
                        className="m-1"
                    >
                        {/* Delete */}
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </CButton>

                    <Link to={data.plant_status === 1 ? `FCIPlantMaster/${data.plant_id}` : ''}>
                        <CButton
                        disabled={data.plant_status === 1 ? false : true}
                        size="sm"
                        color={data.plant_status === 1 ? "success" : "secondary"}
                        shape="rounded"
                        id={data.plant_id}
                        className="m-1"
                        type="button"
                        >
                        {/* Edit */}
                        <i className="fa fa-edit" aria-hidden="true"></i>
                        </CButton>
                    </Link>
                    </div>
                ),
                })
            })
            setRowData(rowDataList)
        })
    },[mount])

    // ============ Column Header Data =======

    const columns = [
        {
        name: 'S.No',
        selector: (row) => row.sno,
        sortable: true,
        center: true,
        },
        {
        name: 'Creation Date',
        selector: (row) => row.Creation_Date,
        sortable: true,
        center: true,
        },
        {
        name: 'Plant Name',
        selector: (row) => row.Plant_Name,
        sortable: true,
        center: true,
        },
        {
        name: 'Plant Symbol',
        selector: (row) => row.Plant_Symbol,
        sortable: true,
        center: true,
        },
        {
        name: 'Plant Code',
        selector: (row) => row.Plant_Code,
        sortable: true,
        center: true,
        }, 
        {
        name: 'Status',
        selector: (row) => row.Status,
        sortable: true,
        center: true,
        },
        {
        name: 'Action',
        selector: (row) => row.Action,
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
                    <Link className="text-white" to="/FCIPlantMaster">
                        <CButton size="sm" color="warning" className="px-5 text-white" type="button">
                        NEW
                        </CButton>
                    </Link>
                    </CCol>
                </CRow>
                <CCard>
                    <CContainer>
                    <CustomTable
                        columns={columns}
                        data={rowData}
                        fieldName={'vehicle_Number'}
                        showSearchFilter={true}
                    />
                    </CContainer>
                </CCard>
                </>) : (<AccessDeniedComponent />
            )}
            </>
        )}
        </>
    )
}

export default FCIPlantMasterTable
