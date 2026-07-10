import React, { useEffect, useState } from 'react'

export default function Title() {
  const [header, setHeader] = useState('Naga Logistics Division')

  useEffect(() => {
    dom[0] ? setHeader(dom[0].getAttribute('title')) : console.log(false)
  })

  const dom = document.getElementsByClassName('nav-link active')

  return (
    <>
      <h3 className="text-info d-md-block d-none fw-bold">{header}</h3>
    </>
  )
}
