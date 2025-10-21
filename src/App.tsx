import React from 'react'
import { Attendance } from './components/Pages/Attendance'
import { Payroll } from './components/Pages/Payroll'
import { Main } from './components/Pages/Main'

export const App = () => {
  return (
    <div>App
      <Attendance/>
      <Payroll/>
      <Main/>
    </div>
  )
}
