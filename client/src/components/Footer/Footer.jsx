import React from 'react'
import './Footer.scss'
import logo from '../../assets/footer-logo.png'

const Footer = () => {
  return (
    <footer>
      <div className="footer-logo">
        <img src={logo} alt="logo" />
      </div>
      <div className='footer-content'>
        <p>Designed & Developed by <a href='https://linkedin.com/in/imsouvikpal' target="_blank" rel="noopener noreferrer">Souvik Pal</a></p>
      </div>
    </footer>
  )
}

export default Footer