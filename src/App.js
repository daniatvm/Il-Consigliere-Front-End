import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Acceso from './components/Acceso/Acceso';
import Inicio from './components/Inicio/Inicio';
import Consejos from './components/Consejos/Consejos';
import Consejo from './components/Consejos/Consejo';
import RegistroConsejos from './components/Consejos/RegistroConsejos';
import VisualizarConsejos from './components/Consejos/VisualizarConsejos';
import ListaUsuarios from './components/Usuarios/ListaUsuarios';
import Registro from './components/Usuarios/Registro';
import Usuario from './components/Usuarios/Usuario';
import Cuenta from './components/Cuenta/Cuenta';
import ProtectedRoute from './helpers/ProtectedRoute';
import DefaultComponent from './helpers/DefaultComponent';
import { Role } from './helpers/Role';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/gUsuarios/registro/:token' component={Registro} />
        <ProtectedRoute path='/gConsejos/registro' role={Role.CouncilModifier} component={RegistroConsejos} />
        <ProtectedRoute path='/gConsejos' role={Role.CouncilModifier} component={VisualizarConsejos} />
        <ProtectedRoute path='/consejos/:consecutivo' role={Role.CouncilModifier} component={Consejo} />
        <ProtectedRoute path='/consejos' component={Consejos} />
        <ProtectedRoute path='/cuenta' component={Cuenta} />
        <ProtectedRoute path='/gUsuarios/:usuario' exact role={Role.UserModifier} component={Usuario} />
        <ProtectedRoute path='/gUsuarios' exact role={Role.UserModifier} component={ListaUsuarios} />
        <Route path='/acceso' component={Acceso} />
        <Route exact path='/' component={Inicio} />
        <Route path='*' component={DefaultComponent} />
      </Switch>
    </Router>
  );
}

export default App;
