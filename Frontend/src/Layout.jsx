import React from 'react'
import Header from './Component/Header/Header'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <>
    <Header />
    <Outlet />
  </>
  )
}

export default Layout
