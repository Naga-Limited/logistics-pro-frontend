import { React } from 'react'
import maintenance_logo from 'src/assets/naga/page-not-found.jpg'

const PageNotFoundComponent = () => {
  return (
    <>
      <div className="card mt-3">
        <img style={{ margin: '5% 25%', borderRadius: '30%' }} src={maintenance_logo} />
      </div>
    </>
  )
}

export default PageNotFoundComponent
