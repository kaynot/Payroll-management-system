import React from 'react'
import { Attendance } from './Component/Pages/Attendance'
import { Payroll } from './Component/Pages/Payroll'
import { Main } from './Component/Pages/Main'

export const App = () => {
  return (
    <div>App
      <Attendance/>
      <Payroll/>
      <Main/>
    </div>
  )
}
