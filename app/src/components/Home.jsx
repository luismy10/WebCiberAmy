import React from "react";

const Home = () => {
  return (
    <main className="app-content">
      <div className="app-title">
        <div>
          <h1>
            <i className="fa fa-smile-o"></i> Bienvenido al Sistema de CiberAmy
          </h1>
        </div>
        <ul className="app-breadcrumb breadcrumb">
          <li className="breadcrumb-item">
            <i className="fa fa-home fa-lg"></i>
          </li>
        </ul>
      </div>

      <div className="tile mb-4 pt-xl-3 pb-xl-3 pl-xl-5">
        <div className="row">
          <div className="col-lg-12">
            <label htmlFor="f-inicio">
              Bienvenido al Sistema encargado de registrar saldos a los usuarios
              para el control de sus ingresos y egresos del CiberAmy
            </label>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
