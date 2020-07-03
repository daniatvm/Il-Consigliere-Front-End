import React, { Component } from 'react';
import auth from '../../helpers/auth';
import Navegacion from '../Navegacion/Navegacion';
import axios from 'axios';

export default class Consejos extends Component {
    constructor(props) {
        super(props);
        const info = auth.getInfo()
        this.state = {
            cedula: info.cedula,
            nombre: info.nombre,
            apellido: info.apellido,
            consejos: []
        }
    }

    componentDidMount() {
        axios.get('/consejo')
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        consejos: res.data.councils
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    getCouncils() {
        const councils = [];
        for (let i = 0; i < this.state.consejos.length; i++) {
            let consecutivo = this.state.consejos[i].consecutivo;
            let institucion = this.state.consejos[i].institucion;
            let escuela = this.state.consejos[i].escuela;
            let consejo = this.state.consejos[i].nombre_consejo;
            let lugar = this.state.consejos[i].lugar;
            let fecha = this.state.consejos[i].fecha;
            let hora = this.state.consejos[i].hora;
            councils.push(
                <div className="col-sm-4" key={i}>
                    <div className="card border-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-4">{institucion}</h5>
                            <h6>{escuela}</h6>
                            <h6>{consejo}</h6>
                            <p className='m-0'>Sesión {consecutivo}</p>
                            <p className='m-0'>Lugar: {lugar}</p>
                            <p className='m-0'>Fecha: {fecha}</p>
                            <p className='m-0'>Hora: {hora}</p>
                        </div>
                    </div>
                </div>
            );
        }
        return councils;
    }

    render() {
        return (
            <>
                <Navegacion />
                <h3>Bienvenid@ {this.state.nombre} {this.state.apellido}</h3>
                <div className="row m-0 mt-4">

                    {this.getCouncils()}
                </div>
            </>
        );
    }
}