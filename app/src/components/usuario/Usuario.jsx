import React from "react";
import { connect } from "react-redux";
import ModalUsuarioAdd from "./ModalUsuarioAdd";
import ModalUsuarioEdit from "./ModalUsuarioEdit";
import ModalTransition from "../transaccion/ModalTransaccion";
import { showModal, viewModal, clearModal, formatMoney } from "../tools/Tools";
import loading from "../../assets/images/loading.gif";
import axios from "axios";
import Paginacion from "../tools/Paginacion";

class Usuario extends React.Component {
  abortController = new AbortController();

  constructor(props) {
    super(props);

    this.state = {
      idUsuario: null,

      loading: false,
      lista: [],

      paginacion: 0,
      totalPaginacion: 0,
      filasPorPagina: 10,
      messagePaginacion: "Mostranto 0 de 0 Páginas",

      privilegio: this.props.token.userToken.privilegio,
    };

    this.refModalUsuarioAdd = React.createRef();
    this.refModalUsuarioEdit = React.createRef();
    this.refModalTransaccion = React.createRef();
  }

  async componentDidMount() {
    //modal usuario agregar
    clearModal("modalUsuario", () => {
      this.refModalUsuarioAdd.current.cleanInput();
    });

    // modal usuario editar
    viewModal("modalUpdateUsuario", () => {
      this.refModalUsuarioEdit.current.loadData(this.state.idUsuario);
    });

    clearModal("modalUpdateUsuario", () => {
      this.setState({ idUsuario: null });
      this.refModalUsuarioEdit.current.cleanInput();
    });

    //modal transaccion
    viewModal("modalTransaccion", () => {
      this.refModalTransaccion.current.loadData(this.state.idUsuario);
    });

    clearModal("modalTransaccion", () => {
      this.setState({ idUsuario: null });
      this.refModalTransaccion.current.cleanInput();
    });

    this.loadInitUsuarios();
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  addOpenModalUsuario() {
    showModal("modalUsuario");
  }

  editOpenModalUsuario(id) {
    this.setState({ idUsuario: id }, () => {
      showModal("modalUpdateUsuario");
    });
  }

  addOpenModalTransaccion(id) {
    this.setState({ idUsuario: id }, () => {
      showModal("modalTransaccion");
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  loadInitUsuarios = async () => {
    if (this.state.loading) return;

    await this.setStateAsync({ paginacion: 1 });
    this.fillTableUsuario(0, "");
  };

  fillTableUsuario = async (opcion, buscar) => {
    try {
      await this.setStateAsync({
        loading: true,
        lista: [],
        messagePaginacion: "Mostranto 0 de 0 Páginas",
      });

      const result = await axios.get("/api/usuario/list", {
        signal: this.abortController.signal,
        params: {
          opcion: opcion,
          buscar: buscar,
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
      });
    } catch (err) {
      this.setState({
        loading: false,
        lista: [],
        totalPaginacion: 0,
        messagePaginacion: "Mostranto 0 de 0 Páginas",
      });
    }
  };

  paginacionContext = async (listid) => {
    await this.setStateAsync({ paginacion: listid });
    this.fillTableUsuario(0, "");
  };

  async onEventSearch(event) {
    if (this.state.loading) return;

    await this.setStateAsync({ paginacion: 1 });
    this.fillTableUsuario(1, event.target.value.trim());
  }

  async onEventReload() {
    this.loadInitUsuarios();
  }

  render() {
    return (
      <>
        <ModalUsuarioAdd
          ref={this.refModalUsuarioAdd}
          title={"Registrar Usuario"}
        />
        <ModalUsuarioEdit
          ref={this.refModalUsuarioEdit}
          title={"Editar Usuario"}
        />

        <ModalTransition ref={this.refModalTransaccion} />

        <main className="app-content">
          <div className="app-title">
            <h1>
              <i className="fa fa-folder"></i> Usuarios <small>Lista</small>
            </h1>
          </div>

          <div className="tile">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="form-group">
                  {this.state.privilegio.agregarUsuario == 1 ? (
                    <button
                      className="btn btn-primary"
                      title="Agregar"
                      onClick={() => this.addOpenModalUsuario()}
                    >
                      <i className="fa fa-plus"></i> Agregar
                    </button>
                  ) : null}

                  <button
                    className="btn btn-secondary ml-1"
                    onClick={() => this.onEventReload()}
                    title="Recargar"
                  >
                    <i className="fa fa-refresh"></i> Recargar
                  </button>
                </div>
              </div>
            </div>

            <div className="row dataTables_wrapper">
              <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">
                <div className="form-group d-flex">
                  <label className="pt-1 pr-1">Buscar: </label>
                  <div className="input-group">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Escribir para filtrar por apellidos o nombres"
                      onKeyUp={(event) => this.onEventSearch(event)}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-success"
                        type="button"
                        id="btnBuscar"
                        title="Buscar"
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
                <div className="form-group dataTables_length text-right">
                  <label className="py-1 pr-1">Mostar</label>
                  <select className="form-control">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label className="py-1 pl-1">Registros</label>
                </div>
              </div> */}
            </div>

            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-header-background">
                      <tr>
                        <th width="5%">N°</th>
                        <th width="30%">Apellidos y nombres</th>
                        <th width="10%">Correo</th>
                        <th width="10%">Celular</th>
                        <th width="10%">Tipo</th>
                        <th width="10%">Estado</th>
                        <th width="10%">Saldo</th>
                        <th width="5%">Editar</th>
                        <th width="5%">Saldo</th>
                        <th width="5%">Detalle</th>
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
                              <td>
                                {<span>{item.documento}</span>}
                                {<br></br>}
                                {<span>{item.informacion}</span>}
                              </td>
                              <td>{item.correo}</td>
                              <td>{item.celular}</td>
                              <td>
                                {item.tipo == 1 ? "ADMINISTRADOR" : "USUARIO"}
                              </td>
                              <td>
                                {item.estado == 1 ? (
                                  <span className="badge badge-success">
                                    ACTIVO
                                  </span>
                                ) : (
                                  <span className="badge badge-danger">
                                    INACTIVO
                                  </span>
                                )}
                              </td>
                              <td className="text-right">
                                {"S/ " + formatMoney(item.monto)}
                              </td>
                              {this.state.privilegio.editarUsuario == 1 ? (
                                <td className="text-center">
                                  <button
                                    className="btn btn-warning"
                                    onClick={() =>
                                      this.editOpenModalUsuario(item.idUsuario)
                                    }
                                  >
                                    <i className="fa fa-edit"></i>
                                  </button>{" "}
                                </td>
                              ) : (
                                <td className="text-center">-</td>
                              )}

                              {this.state.privilegio.procesarSaldo == 1 ? (
                                <td className="text-center">
                                  <button
                                    className="btn btn-info"
                                    onClick={() =>
                                      this.addOpenModalTransaccion(
                                        item.idUsuario
                                      )
                                    }
                                  >
                                    <i className="fa fa-money"></i>
                                  </button>
                                </td>
                              ) : (
                                <td className="text-center">-</td>
                              )}

                              {this.state.privilegio.verSaldo == 1 ? (
                                <td className="text-center">
                                  <button
                                    className="btn btn-dark"
                                    onClick={() =>
                                      this.props.history.push({
                                        pathname: `/transaccion`,
                                        search: "?idUsuario=" + item.idUsuario,
                                      })
                                    }
                                  >
                                    <i className="fa fa-arrow-right"></i>
                                  </button>
                                </td>
                              ) : (
                                <td className="text-center">-</td>
                              )}
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
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.reducer,
  };
};

export default connect(mapStateToProps)(Usuario);
