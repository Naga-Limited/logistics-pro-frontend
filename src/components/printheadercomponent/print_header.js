import { CCol, CRow } from '@coreui/react'
import { React } from 'react'
import houseofnaga from 'src/assets/naga/houseofnaga.png'
import nagalogo from 'src/assets/naga/nagalogo.png'
import Company_Details from 'src/assets/naga/Company_Details.png'
import Company_Foods_Details from 'src/assets/naga/company_foods_details.png'

const Print_header = (type) => {
  console.log(type,'type-type')
  return (
    <>
    <div>
        {/* <table height="700" border="0" cellSpacing="0" cellPadding="4"> */}
        <tr>
            <td width={type.type ? "90" : "150"} align="left"><img src={houseofnaga} /></td>
            {/* <td width="400" align="center">
                      <b><h5 style={{fontSize:'15px'}}><strong>NAGA LIMITED</strong><br />
                      LOGISTICS DIVISION</h5><br /></b>
                      <p style={{marginTop:'-25px',marginBottom:'-10px',fontSize:'9px'}}>
                      FSSAI No 10017042003098<br />
                      No 1, Trichy Road, Dindigul-624005, Tamilnadu.<br />
                      GSTIN : 33AAACN2369L1ZD, PAN : AAACN2369L,<br />
                      CIN : U10611TN1991PLC020409, State Code - 33.<br /><br /></p>
            </td> */}
          <td width="300" align="center"><img src={type.type ? Company_Foods_Details : Company_Details} /></td>
          <td width="150" align="right"><img src={nagalogo} /></td>
          </tr>
        {/* </table> */}
      </div>
    </>
  )
}

export default Print_header
