import React, { Component } from 'react';
import auth from '../../helpers/auth';
import Navegacion from '../Navegacion/Navegacion';

export default class Consejos extends Component {
    constructor(props) {
        super(props);
        const info = auth.getInfo()
        this.state = {
            cedula: info.cedula,
            nombre: info.nombre,
            apellido: info.apellido
        }
    }

    render() {
        return (
            <>
                <Navegacion />
                <div className='container'>
                    <h3>Bienvenid@ {this.state.nombre} {this.state.apellido}</h3>
                </div>
            </>
        );
    }
}