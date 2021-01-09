import React from 'react'
import { Switch } from 'react-router-dom'

import RouteHandler from './components/RouteHandler'
import Home from './pages/home'
import About from './pages/about'
import Signin from './pages/signin'
import Signup from './pages/signup'
import AdPage from './pages/adPage'
import AddAd from './pages/addAd'
import Ads from './pages/Ads'

import NotFound from './pages/notFound'

export default () => {
    return (
        <Switch>
            
            <RouteHandler exact path="/">
                <Home />
            </RouteHandler>

            <RouteHandler exact path="/about">
                <About />
            </RouteHandler>

            <RouteHandler exact path="/signin">
                <Signin />
            </RouteHandler>

            <RouteHandler exact path="/signup">
                <Signup />
            </RouteHandler>

            <RouteHandler path="/ad/:id">
                <AdPage />
            </RouteHandler>

            <RouteHandler private path="/post-an-ad">
                <AddAd />
            </RouteHandler>

            <RouteHandler path="/ads">
                <Ads />
            </RouteHandler>

            <RouteHandler>
                <NotFound />
            </RouteHandler>

        </Switch>
    )
}
