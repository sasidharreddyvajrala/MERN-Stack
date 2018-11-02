import React from 'react';
import {Route,Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import Login from '../components/login';
import App from '../App';

const AppRouter=()=>(
    <BrowserRouter>
    <div>
    <Switch>
    <Route path="/" component={App} exact={true}/>
    <Route path="/login" component={Login}/>
    </Switch>
    </div>
    </BrowserRouter>
);

export default AppRouter;