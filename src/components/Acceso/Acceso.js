import React, { Component } from 'react';
import axios from 'axios';
import './Acceso.css';

export default class Acceso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cedula: '',
            clave: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        if ((name === 'cedula') && (!Number(value)) && (value !== '')) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const usuario = {
            cedula: this.state.cedula,
            clave: this.state.clave
        }
        axios.post('http://localhost:5000/usuario/inicio_sesion', usuario)
            .then((res) => {
                // sweet alert
                if(res.data.success){
                    localStorage.setItem('login', JSON.stringify({
                        token: res.data.token
                    }));
                    this.props.history.push('/consejos');
                }else{
                    this.setState({
                        clave: ''
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    render() {
        return (
            <div className="row m-0 my-row">
                <div className="col-md-4 mx-auto my-auto">
                    <div className="card border-primary mb-3">
                        <div className="card-body">
                            <h4 className="card-title text-center mb-4">Il Consigliere</h4>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input type="text" required maxLength="20" name="cedula"
                                    placeholder="Cédula" autoComplete="off" className="form-control"
                                    autoFocus onChange={this.handleInputChange} value={this.state.cedula} />
                                </div>
                                <div className="form-group">
                                    <input type="password" required maxLength="20" name="clave"
                                    placeholder="Contraseña" className="form-control"
                                    onChange={this.handleInputChange} value={this.state.clave} />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-outline-primary btn-block mt-4">Accesar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* hacer un informativo de pedir al administrador los datos */}
                </div>
            </div>
        );
    }
}