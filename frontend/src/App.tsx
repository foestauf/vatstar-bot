import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './home';
import { NavigationBar } from './layout/navbar';
import { Login } from './login';

export function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <p>Vatstar Discord Control Panel</p>
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
      </Router>
    </div>
  );
}
