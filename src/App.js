import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Acceso from './components/Acceso/Acceso';
import { Inicio } from './components/Inicio/Inicio';
import Navegacion from './components/Navegacion/Navegacion'

function App() {
  return (
    <Router>
      <Navegacion />
      <Switch>
        <Route path="/acceso"
          render={(routeProps) =>{
            return <Acceso {...routeProps}/>
          }}
        />
        <Route path="/consejos">
          <h1>Hola</h1>
        </Route>
        <Route exact path="/">
          <Inicio />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
