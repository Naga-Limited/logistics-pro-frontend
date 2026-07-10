import { React } from 'react'
import maintenance_logo from 'src/assets/naga/site_down.gif'
import naga_logo from 'src/assets/naga/right.jpg'
import naga_logo1 from 'src/assets/naga/naga_3.png'
import { Alignment } from 'react-data-table-component'

const Maintenance = () => {
  return (
    <>
       <div className="App" style={{textAlign:'center'}}>
       <div style={{display:'flex'}}>
            <img width={"150px"} height={"150px"} style={{ margin:'1% 2% 1% 32%', border:'2px solid black', borderRadius: '10%' }} src={naga_logo} />
            <img width={"300px"} height={"150px"} style={{ margin:'1% 2%', border:'2px solid black', borderRadius: '10%' }} src={naga_logo1} />
        </div>
        <img style={{ margin: '1% 25%', border:'2px solid black', borderRadius: '10%' }} src={maintenance_logo} />
      </div>
    </>
  )
}

export default Maintenance
