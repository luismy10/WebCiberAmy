import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { formatMoney } from "../tools/Tools";
import loading from "../../assets/images/loading.gif";
import Paginacion from "../tools/Paginacion";

class Transaccion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idUsuario: "",
      celular: "",
      informacion: "",

      loading: true,
      lista: [],

      paginacion: 0,
      totalPaginacion: 0,
      filasPorPagina: 10,
      messagePaginacion: "Mostranto 0 de 0 Páginas",
    };
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async componentDidMount() {
    const url = this.props.location.search;
    const idUsuario = new URLSearchParams(url).get("idUsuario");
    if (idUsuario == null) {
      this.props.history.goBack();
      return;
    }
    if (idUsuario == "") {
      this.props.history.goBack();
      return;
    }
    await this.setStateAsync({ paginacion: 1, idUsuario: idUsuario });
    this.loadDatTransaccion();
  }

  async loadDatTransaccion() {
    try {
      let result = await axios.get("/api/transaccion/list", {
        params: {
          idUsuario: this.state.idUsuario,
          posicionPagina:
            (this.state.paginacion - 1) * this.state.filasPorPagina,
          filasPorPagina: this.state.filasPorPagina,
        },
      });

      let totalPaginacion = parseInt(
        Math.ceil(parseFloat(result.data.total) / this.state.filasPorPagina)
      );
      let messagePaginacion = `Mostrando ${result.data.result.length} de ${totalPaginacion} Páginas`;

      this.setState({
        loading: false,
        lista: result.data.result,
        totalPaginacion: totalPaginacion,
        messagePaginacion: messagePaginacion,
        celular: result.data.usuario.celular,
        informacion: result.data.usuario.informacion,
      });
    } catch (error) {
      this.setState({
        loading: false,
        lista: [],
        totalPaginacion: 0,
        messagePaginacion: "Mostranto 0 de 0 Páginas",
      });
    }
  }

  paginacionContext = async (listid) => {
    await this.setStateAsync({ paginacion: listid });
    this.loadDatTransaccion();
  };

  render() {
    return (
      <main className="app-content">
        <div className="app-title">
          <h1>
            <i className="fa fa-folder"></i> Transacciones <small>Lista</small>
          </h1>
        </div>

        <div className="tile">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="bs-component">
                <h2>{this.state.celular}</h2>
                <p>{this.state.informacion}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table-header-background">
                    <tr>
                      <th width="5%">N°</th>
                      <th width="45%">Transacción</th>
                      <th width="25%">Fecha</th>
                      <th width="25%">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.loading ? (
                      <tr>
                        <td className="text-center" colSpan="10">
                          <img src={loading} width="34" height="34" />
                          <p>Cargando información...</p>
                        </td>
                      </tr>
                    ) : this.state.lista.length === 0 ? (
                      <tr>
                        <td className="text-center" colSpan="10">
                          ¡No hay Usuarios registrados!
                        </td>
                      </tr>
                    ) : (
                      this.state.lista.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-center">{item.id}</td>
                            <td className="text-left">
                              {item.tipo == 1 ? "INGRESO" : "DESCUENTO"}
                              {<br />}
                              {item.comentario}
                            </td>
                            <td className="text-left">
                              {item.fecha}
                              {<br />}
                              {item.hora}
                            </td>
                            <td
                              className={
                                "text-left " +
                                (item.tipo == 1
                                  ? "text-success"
                                  : "text-danger")
                              }
                            >
                              {"S/ "}
                              {item.tipo == 1 ? "+" : "-"}
                              {formatMoney(item.monto)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer">
            <div className="row">
              <div className="col-sm-12 col-md-5">
                <div
                  className="dataTables_info"
                  role="status"
                  aria-live="polite"
                >
                  {this.state.messagePaginacion}
                </div>
              </div>
              <div className="col-sm-12 col-md-7">
                <div className="dataTables_paginate paging_simple_numbers">
                  <ul className="pagination">
                    <Paginacion
                      totalPaginacion={this.state.totalPaginacion}
                      paginacion={this.state.paginacion}
                      paginacionContext={this.paginacionContext}
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.reducer,
  };
};

export default connect(mapStateToProps)(Transaccion);
