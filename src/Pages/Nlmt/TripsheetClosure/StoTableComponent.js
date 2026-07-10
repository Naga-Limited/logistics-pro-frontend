import React from 'react'
import PropTypes from 'prop-types'
import { CTable, CTableBody, CTableHead } from '@coreui/react'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { useState } from 'react'
import { useEffect } from 'react'

const StoTableComponent = (props) => {
  console.log(props.stoTableData)
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
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])

  const location_name = (code) => {
    let plant_name = ''

    plantMasterData.map((val, key) => {
      if (val.definition_list_code == code) {
        plant_name = val.definition_list_name
      }
    })

    return plant_name
  }

  return (
    <>
      <div>
        <h3>{props.title} </h3>
        {props.stoTableData.length ? (
          <CTable className="table table-sm" responsive="xxl">
            <CTableHead color="primary">
              <tr>
                <th scope="col" data-tip>
                  <span title="STO Delivery Number">Delivery No.</span>
                </th>
                <th scope="col" data-tip>
                  <span title="STO PO Number">PO No.</span>
                </th>
                <th scope="col" data-tip>
                  <span title="STO Division">Division</span>
                </th>
                <th scope="col">From Location</th>
                <th scope="col">To Location</th>
                <th scope="col">
                  <span title="Delivery Quantity in MTS">DQ in MTS</span>
                </th>
                <th scope="col">Freight Amount</th>
                <th scope="col">
                  <span title="Delivery Date and Time">Date & Time</span>
                </th>
                {/* {!props.hireVehicle && <th scope="col">Driver Name</th>} */}
                {/* <th scope="col">
                  <span title="Expense To Be Capture">Exp. Capture</span>
                </th> */}
                <th scope="col">Action</th>
                {/* <th scope="col">Delete</th> */}
              </tr>
            </CTableHead>
            <CTableBody>
              {props.stoTableData.map((stoData, index) => (
                <tr key={`stoTableData${index}`}>
                  <td>{stoData.sto_delivery_number || stoData.sto_delivery_no}</td>
                  <td>{stoData.sto_po_number || stoData.sto_po_no}</td>
                  <td>{stoData.sto_delivery_division || ''}</td>
                  <td>
                    {location_name(stoData.sto_from_location) ||
                      location_name(stoData.from_location)}
                  </td>
                  <td>
                    {location_name(stoData.sto_to_location) || location_name(stoData.to_location)}
                  </td>
                  <td>{stoData.sto_delivery_quantity}</td>
                  <td>{stoData.sto_freight_amount || stoData.freight_amount}</td>
                  <td>{stoData.sto_delivery_date_time || stoData.delivered_date_time}</td>
                  {/* <td>{stoData.sto_pod_copy}</td> */}
                  {/* {!props.hireVehicle && (
                    <td>{stoData.sto_delivery_driver_name || stoData.driver_name}</td>
                  )} */}
                  {/* <td>{stoData.sto_delivery_expense_capture ? 'Yes' : 'No'}</td> */}
                  <td>
                    <button
                      type="button"
                      disabled={props.isStoEditMode}
                      onClick={() => onEdit(index)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>

                    <button
                      type="button"
                      disabled={props.isStoEditMode}
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
StoTableComponent.propTypes = {
  stoTableData: PropTypes.array.isRequired,
  title: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

StoTableComponent.defaultProps = {
  title: '',
}
export default StoTableComponent
