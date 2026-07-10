import React from 'react'
import PropTypes from 'prop-types'
import { CTable, CTableBody, CTableHead } from '@coreui/react'
import { useState } from 'react'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { useEffect } from 'react'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'

const StoTableOthersComponent = (props) => {
  console.log(props.stoOthersTableData)
  const isHireVehicle = props.hireVehicle
  const tripInfo = props.tripInfo
  console.log(tripInfo,'StoTableOthersComponent-tripInfo')
  console.log(isHireVehicle,'StoTableOthersComponent-isHireVehicle')
  const onEdit = (index) => {
    props.onEdit(index)
  }

  // const editMode = () => {
  //     props.editMode(true);
  // }

  const onDelete = (index) => {
    props.onDelete(index)
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  const [VRData, setVRData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])

  useEffect(()=>{
    VehicleRequestMasterService.getVehicleRequests().then((response)=>{
      let viewData = response.data.data
      console.log(viewData,'getVehicleRequests')
      setVRData(viewData)
    })
  },[props.stoOthersTableData])

  const fetch_vr_no = (id) =>{
    let vrno = '-'
    console.log(id,'fetch_vr_no-id')
    console.log(VRData,'fetch_vr_no-VRData')
    VRData.map((vk,kk)=>{
      if(vk.vr_id == id){
        vrno = vk.vr_no
      }
    },[])
    return vrno
  }

  const location_name = (code) => {
    let plant_name = ''

    plantMasterData.map((val, key) => {
      if (val.definition_list_code == code) {
        plant_name = val.definition_list_name
      }
    })
    // className="table table-lg"
    return plant_name
  }

  return (
    <>
      <div>
        <h3>{props.title} </h3>
        {props.stoOthersTableData.length ? (
          <CTable striped={true} className="overflow-scroll table-lg" responsive  style={{ overflow: 'scroll', width: '100%' }}>
            <CTableHead style={{ width: '100%' }} color="primary">
              <tr>
                <th style={{ width: '13%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="Others Document Process Type">Process Type</span>
                </th>
                <th style={{ width: '10%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="Others Document Number">Doc. No</span>
                </th>
                <th style={{ width: '10%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="Others Purchase Order Number">PO. No</span>
                </th>
                <th style={{ width: '8%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="Others Document Date">Doc. Date</span>
                </th>
                <th style={{ width: '10%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="From Plant Name">VR No</span>
                </th>
                <th style={{ width: '6%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="From Plant Name">From Plant</span>
                </th>
                {/* <th style={{ width: '6%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="From Plant Code">Code</span>
                </th> */}
                <th style={{ width: '6%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="To Plant Name">To Plant</span>
                </th>
                {/* <th style={{ width: '6%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="To Plant Code">Code</span>
                </th> */}
                <th style={{ width: '10%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="Vendor Name">Vendor Name</span>
                </th>
                <th style={{ width: '6%', textAlign: 'center' }} scope="col" data-tip>
                  <span title="Vendor Code">Code</span>
                </th>
                <th style={{ width: '5%', textAlign: 'center' }} scope="col">
                  <span title="Quantity in MTS">DQ in MTS</span>
                </th>
                <th style={{ width: '6%', textAlign: 'center' }} scope="col">
                  <span title="Freight Amount">Freight </span>
                </th>
                {/* <th scope="col">
                  <span title="Delivery Date and Time">Date & Time</span>
                </th> */}
                {/* <th scope="col">POD Copy</th> */}
                {/* {!props.hireVehicle && <th scope="col">Driver Name</th>} */}
                {/* <th scope="col">
                  <span title="Expense To Be Capture">Exp. Capture</span>
                </th> */}
                <th style={{ width: '10%', textAlign: 'center' }} scope="col">Action</th>
                {/* <th scope="col">Delete</th> */}
              </tr>
            </CTableHead>
            <CTableBody>
              {props.stoOthersTableData.map((sotData, index) => (
                <tr key={`sotData${index}`} style={{ width: '100%', textAlign: 'center' }}>
                  <td style={{ width: '13%', textAlign: 'center' }}>{sotData.others_sto_process_type}</td>
                  <td style={{ width: '10%', textAlign: 'center' }}>{sotData.others_sto_doc_number}</td>
                  <td style={{ width: '10%', textAlign: 'center' }}>{sotData.others_sto_po_number || '-'}</td>
                  <td style={{ width: '8%', textAlign: 'center' }}>{sotData.others_sto_doc_date}</td>
                  {tripInfo.trip_sheet_info && isHireVehicle ? (
                    <td style={{ width: '10%', textAlign: 'center' }}>{fetch_vr_no(tripInfo.trip_sheet_info.vehicle_requests)}</td>
                  ) : (
                    <td style={{ width: '10%', textAlign: 'center' }}>{fetch_vr_no(sotData.others_sto_vr_id)}</td>
                  )}
                  <td style={{ width: '6%', textAlign: 'center' }}>{sotData.others_sto_from_plant_code || '-'}</td>
                  {/* <td style={{ width: '10%', textAlign: 'center' }}>{sotData.others_sto_to_plant_name || '-'}</td> */}
                  <td style={{ width: '6%', textAlign: 'center' }}>{sotData.others_sto_to_plant_code || '-'}</td>
                  <td style={{ width: '10%', textAlign: 'center' }}>{sotData.others_sto_vendor_name || '-'}</td>
                  <td style={{ width: '6%', textAlign: 'center' }}>{sotData.others_sto_vendor_code || '-'}</td>
                  <td style={{ width: '5%', textAlign: 'center' }}>{sotData.others_sto_delivery_quantity}</td>
                  <td style={{ width: '6%', textAlign: 'center' }}>{sotData.others_sto_freight_amount}</td>

                  {/* <td>{stoData.sto_pod_copy}</td> */}
                  {/* {!props.hireVehicle && (
                    <td>{stoData.sto_delivery_driver_name_rmsto || stoData.driver_name}</td>
                  )} */}
                  {/* <td>{stoData.sto_delivery_driver_name_rmsto}</td> */}
                  {/* <td>{stoData.sto_delivery_expense_capture_rmsto ? 'Yes' : 'No'}</td> */}
                  <td style={{ width: '10%', textAlign: 'center' }}>
                    <button
                      type="button"
                      disabled={props.isOthersStoEditMode}
                      onClick={() => onEdit(index)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>

                    <button
                      type="button"
                      disabled={props.isOthersStoEditMode}
                      onClick={() => onDelete(index)}
                      style={{ marginLeft: '15px' }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p>No Data</p>
        )}
      </div>
    </>
  )
}
StoTableOthersComponent.propTypes = {
  stoOthersTableData: PropTypes.array.isRequired,
  title: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

StoTableOthersComponent.defaultProps = {
  title: '',
}
export default StoTableOthersComponent
