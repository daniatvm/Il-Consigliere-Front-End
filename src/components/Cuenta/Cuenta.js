import React, { Component } from 'react';
import Navegacion from '../Navegacion/Navegacion'

export default class Cuenta extends Component {
    constructor(props){
        super(props);
        this.state = {
            anterior: '',
            nueva: '',
            confirmacion: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e){
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e){
        e.preventDefault();
        //verificar largo de contraseñas
        alert('cambio');
    }

    render() {
        return (
            <>
                <Navegacion />
                <div className="row m-0 my-row">
                    <div className="col-md-5 mx-auto my-auto">
                        <div className="card border-primary mb-3">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Cambio de Contraseña</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="password" required maxLength="20" name="anterior"
                                            placeholder="Contraseña anterior" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.anterior} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" required maxLength="20" name="nueva"
                                            placeholder="Contraseña nueva" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.nueva} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" required maxLength="20" name="confirmacion"
                                            placeholder="Confirmación" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.confirmacion} />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-outline-primary btn-block mt-4">Accesar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* mostrar requerimientos */}
                    </div>
                </div>
            </>
        );
    }
}