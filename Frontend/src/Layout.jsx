import React from 'react'
import Header from './Component/Header/MainNavbar'
import { Outlet } from 'react-router'
import Footer from './Component/Footer/Footer'
import MainNavbar from './Component/Header/MainNavbar'

function Layout() {
  return (
    <>
    <MainNavbar />
    <Outlet />
    <Footer/>
  </>
  )
}

export default Layout
