
const apiUrl = process.env.REACT_APP_BASEURL
console.log(apiUrl,'apiUrl')
const AppConfig = {
  version: '1.0.0',
  api: { baseUrl: apiUrl}
  // api: {
  //   // baseUrl: 'https://logiprouat.nagamills.com/LP_API/api/v1', /* UAT Server */
  //   // baseUrl: 'https://logisticspro.nagamills.com/LP_API/api/v1', /* Production Server */
  //   baseUrl: 'http://127.0.0.1:8000/api/v1', /* DEV Server */
  // },
}

export default AppConfig
