import React from 'react'
import Header from './Component/Header/Header'
import { Outlet } from 'react-router'
import Footer from './Component/Footer/Footer'

function Layout() {
  return (
    <>
    <Header />
    <Outlet />
    <Footer/>
  </>
  )
}

export default Layout
