import React from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Navbar } from '../../components'

const BadRequest = () => {
  useDocumentTitle(`Page not found`)
  return (
    <>
      <Navbar />

      <div className='container'>
        <section className='wrapper'>
          <h2 className='empty-content'>Sorry, page not found!!!</h2>
        </section>
      </div>
    </>
  )
}

export default BadRequest