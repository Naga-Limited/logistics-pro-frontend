import { CButton, CCard, CContainer, CCol, CRow, CModal, CModalHeader, CModalTitle, CModalBody, CCardImage, CModalFooter } from "@coreui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomTable from "src/components/customComponent/CustomTable";
const ShedMasterTable = () => {
    const [OdometerPhoto, setOdometerPhoto] = useState(false)
    const [RCCopyFront, setRCCopyFront] = useState(false)
    const [RCCopyBack, setRCCopyBack] = useState(false)
    const [InsuranceCopyBack, setInsuranceCopyBack] = useState(false)
    const [InsuranceCopyFront, setInsuranceCopyFront] = useState(false)
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
            name: 'Driver Type',
            selector: (row) => row.Driver_Type,
            sortable: true,
            center: true,
        },
        {
            name: 'Shed Name',
            selector: (row) => row.Shed_Name,
            sortable: true,
            center: true,
        },
        {
            name: 'Shed Owner Name',
            selector: (row) => row.Shed_Owner_Name,
            sortable: true,
            center: true,
        },
        {
            name: 'Shed Owner Mobile Number 1',
            selector: (row) => row.Shed_Owner_Mobile_Number1,
            sortable: true,
            center: true,
        },
        {
            name: 'Shed Owner Mobile Number 2',
            selector: (row) => row.Shed_Owner_Mobile_Number2,
            sortable: true,
            center: true,
        },
        {
            name: 'Shed Owner Address',
            selector: (row) => row.Shed_Owner_Address,
            center: true,
        },
        {
            name: ' Shed Owner Photo',
            selector: (row) => row.Shed_Owner_Photo,
            center: true,
        },
        {
            name: 'PAN Number',
            selector: (row) => row.PAN_Number,
            center: true,
        },
        {
            name: 'GST Number',
            selector: (row) => row.GST_Number,
            center: true,
        },
        {
            name: 'Status',
            selector: (row) => row.Status,
            center: true,
        },
        {
            name: 'Action',
            selector: (row) => row.Action,
            center: true,
        },

    ]

    const data = [
        {
            sno: 1,
            Creation_Date: '12.12.2021',
            Driver_Type: 'Own',
            Shed_Name: 'Subash',
            Shed_Owner_Name: 'Kumar',
            Shed_Owner_Mobile_Number1: '9813792723',
            Shed_Owner_Mobile_Number2: '9813792723',
            Shed_Owner_Address: 'Dindigul',
            Shed_Owner_Photo: (<span><CButton
                onClick={() => setInsuranceCopyBack(!InsuranceCopyBack)}
                className="w-100 m-0"
                color=""
                size="sm"
                id="inputAddress"
            >
                <span className="float-start">
                    <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                </span>
            </CButton>
                <CModal visible={InsuranceCopyBack} onClose={() => setInsuranceCopyBack(false)}>
                    <CModalHeader>
                        <CModalTitle>Photo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CCardImage
                            orientation="top"
                            src=""
                        />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => InsuranceCopyBack(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal></span>),
            PAN_Number: 'ASDFG1234F',
            GST_Number: '33ASDFG1234F2Z5',
            Status: <span className="badge rounded-pill bg-info">Active</span>,
            Action: (<span>
                <CButton className="btn btn-danger" color="">
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                <CButton className="btn btn-dark" color="white">
                    <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
            </span>
            ),
        },
    ]

    return (

        <CCard className="mt-4">
            <CContainer className="mt-2">
                <CustomTable columns={columns} data={data} />
                <hr></hr>
                <CRow className="mt-3">
                    <CCol
                        className="offset-md-6"
                        xs={15}
                        sm={15}
                        md={6}
                        style={{ display: 'flex', justifyContent: 'end' }}
                    >
                        <CButton
                            size="sm"
                            color="warning"
                            // disabled={enableSubmit}
                            className="px-3 text-white"
                            type="submit"
                        >
                            <Link className="text-white" to="/ShedMaster">
                                New
                            </Link>
                        </CButton>
                    </CCol>
                </CRow>

            </CContainer>
        </CCard>
    );
}

export default ShedMasterTable;
