import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './pages/home'
import About from './pages/about'
import Signin from './pages/signin'
import Signup from './pages/signup'
import NotFound from './pages/notFound'

export default () => {
    return (
        <Switch>
            
            <Route exact path="/">
                <Home />
            </Route>

            <Route exact path="/about">
                <About />
            </Route>

            <Route exact path="/signin">
                <Signin />
            </Route>

            <Route exact path="/signup">
                <Signup />
            </Route>

            <Route>
                <NotFound />
            </Route>

        </Switch>
    )
}