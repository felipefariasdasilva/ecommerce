import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes'
import { Template } from './components/MainComponents'
import Header from './components/partials/header'
import Footer from './components/partials/footer'
import './App.css'

const Page = (props) => {

  return(

    <BrowserRouter>
      <Template>
        <Header />
        <Routes />
        <Footer />
      </Template>
    </BrowserRouter>

  )

}

const mapStateProps = (state) => {
  
  return{
    user: state.user
  }

}

const mapDispatchToProps = (dispatch) => {

  return{}

}

export default connect(mapStateProps, mapDispatchToProps)(Page)
