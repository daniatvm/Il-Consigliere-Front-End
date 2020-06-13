import React from 'react';
import logo from '../assets/tec.png';
import Navegacion from '../components/Navegacion/Navegacion';

export const DefaultComponent = () => {
    return (
        <>
            <Navegacion />
            <div className="row m-0" style={{ height: '80vh' }}>
                <div className="col-sm-12 my-auto">
                    <h3 className='text-center'>Página no encontrada</h3>
                    <h1 className='text-center'>404</h1>
                    <img src={logo} className='rounded-circle img-fluid m-auto d-block' style={{ opacity: 0.6 }} alt='logo' />
                </div>
            </div>
        </>
    );
}
