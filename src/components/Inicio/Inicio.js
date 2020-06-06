import React from 'react';
import './Inicio.css';
import Navegacion from '../Navegacion/Navegacion';

export const Inicio = () => {
    return (
        <>
            <Navegacion />
            <div className="row m-0 my-row">
                <div className="col-sm-12 my-auto">
                    <div className="container bounce">
                        <h3 className="title text-center">Consejo de Ingeniería en Computación<br /> del Campus Tecnológico Local de San José</h3>
                        <div className="special-div">
                            <img src="https://www.tec.ac.cr/sites/default/files/media/img/main/tec_san_jose.jpg" className="rounded img-fluid handler" alt="Escuela de Computación San José" />
                            <p className="description">La Escuela de Ingeniería en Computación ha creado un sólido prestigio como centro de excelencia en la enseñanza y en la investigación aplicada. Ofrece opciones académicas en la Sede Central en Cartago ,  y en las Sedes de San Carlos, Alajuela, Limón y San José.<br />
                    Su misión es: Contribuir a la sociedad costarricense en la generación de conocimiento científico-tecnológico en computación a través de la docencia, investigación, extensión y vinculación externa, basados en principios de excelencia académica, pertinencia social, regionalización, equidad y formación integral.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
