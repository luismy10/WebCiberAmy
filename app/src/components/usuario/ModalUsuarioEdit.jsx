import React, { Component } from "react";
import axios from "axios";
import {
  hideModal,
  ModalAlertInfo,
  ModalAlertSuccess,
  ModalAlertWarning,
  keyNumberInteger,
} from "../tools/Tools";

class ModalUpdateUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idUsuario: "",
      errormessage: "",
      atribTypeClave: "password",
      documento: "",
      informacion: "",
      celular: "",
      email: "",
      clave: "",
      tipo: "",
      estado: "1",

      agregarUsuario: false,
      editarUsuario: false,
      procesarSaldo: false,
      verSaldo: false,
      moduloReporte: false,

      loading: true,
      messageLoading: "Cargando información...",
    };

    this.refDocumento = React.createRef();
    this.refInformacion = React.createRef();
    this.refCelular = React.createRef();
    this.refEmail = React.createRef();
    this.refTipo = React.createRef();
    this.refClave = React.createRef();
  }

  async loadData(id) {
    this.setState({ loading: true });

    try {
      const result = await axios.get("/api/usuario/id", {
        params: {
          idUsuario: id,
        },
      });

      let usuario = result.data.usuario;
      let privilegio = result.data.privilegio;
      console.log(privilegio);

      this.setState({
        documento: usuario.documento.toString(),
        informacion: usuario.informacion,
        celular: usuario.celular,
        email: usuario.email,
        clave: usuario.clave,
        tipo: usuario.tipo,
        idUsuario: id,

        agregarUsuario: privilegio.agregarUsuario == 1 ? true : false,
        editarUsuario: privilegio.editarUsuario == 1 ? true : false,
        procesarSaldo: privilegio.procesarSaldo == 1 ? true : false,
        verSaldo: privilegio.verSaldo == 1 ? true : false,
        moduloReporte: privilegio.moduloReporte == 1 ? true : false,

        loading: false,
      });
    } catch (error) {
      if (error.response != null || error.response != undefined) {
        this.setState({
          messageLoading:
            "Se produjo un error 500, comuníquese con su proveedor.",
        });
      } else {
        this.setState({
          messageLoading:
            "Se produjo un error 400 del clíente, comuníquese con su proveedor.",
        });
      }
    }
  }

  async editUser() {
    if (this.state.documento == "") {
      this.refDocumento.current.focus();
    } else if (this.state.informacion == "") {
      this.refInformacion.current.focus();
    } else if (this.state.celular == "") {
      this.refCelular.current.focus();
    } else if (this.state.tipo == "") {
      this.refTipo.current.focus();
    } else if (this.state.clave == "") {
      this.refClave.current.focus();
    } else {
      try {
        ModalAlertInfo("Usuario", "Procesando petición...");
        hideModal("modalUpdateUsuario");
        const result = await axios.post("/api/usuario/edit", {
          documento: this.state.documento.trim(),
          informacion: this.state.informacion.trim().toUpperCase(),
          celular: this.state.celular.trim(),
          email: this.state.email.trim(),
          clave: this.state.clave.trim(),
          tipo: this.state.tipo,
          estado: this.state.estado,
          idUsuario: this.state.idUsuario,

          agregarUsuario: this.state.agregarUsuario,
          editarUsuario: this.state.editarUsuario,
          procesarSaldo: this.state.procesarSaldo,
          verSaldo: this.state.verSaldo,
          moduloReporte: this.state.moduloReporte,
        });
        ModalAlertSuccess("Usuario", result.data);
      } catch (error) {
        console.error(error);
        if (error.response != null || error.response != undefined) {
          ModalAlertWarning("Usuario", error.response.data);
        } else {
          ModalAlertWarning(
            "Usuario",
            "Se produjo un error interno, intente nuevamente por favor."
          );
        }
      }
    }
  }

  cleanInput() {
    this.setState({
      errormessage: "",
      documento: "",
      informacion: "",
      celular: "",
      email: "",
      clave: "",
      estado: "1",
    });
  }

  watchPassword = (event) => {
    if (event.type === "mousedown") {
      this.setState({ atribTypeClave: "text" });
    } else {
      this.setState({ atribTypeClave: "password" });
    }
  };

  render() {
    return (
      <div className="row">
        <div
          className="modal fade"
          id="modalUpdateUsuario"
          data-backdrop="static"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <i className="fa fa-window-maximize"></i> {this.props.title}
                </h4>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  title="Cerrar"
                >
                  <i className="fa fa-close"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="tile border-0 p-0">
                  {this.state.loading ? (
                    <div className="overlay p-5">
                      <div className="m-loader mr-4">
                        <svg className="m-circular" viewBox="25 25 50 50">
                          <circle
                            className="path"
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            strokeWidth="4"
                            strokeMiterlimit="10"
                          ></circle>
                        </svg>
                      </div>
                      <h4
                        className="l-text text-center text-white p-10"
                        id="lblTextOverlayBanco"
                      >
                        {this.state.messageLoading}
                      </h4>
                    </div>
                  ) : null}

                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>N° de Documento</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            ref={this.refDocumento}
                            value={this.state.documento}
                            maxLength={50}
                            onChange={(event) =>
                              this.setState({ documento: event.target.value })
                            }
                            placeholder="Dijite su n° de documento"
                            onKeyPress={keyNumberInteger}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Apellidos y Nombres</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            ref={this.refInformacion}
                            value={this.state.informacion}
                            maxLength={30}
                            onChange={(event) =>
                              this.setState({ informacion: event.target.value })
                            }
                            placeholder="Dijite sus apellidos y nombres"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>N° de Celular</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            ref={this.refCelular}
                            value={this.state.celular}
                            maxLength={50}
                            onChange={(event) =>
                              this.setState({ celular: event.target.value })
                            }
                            placeholder="Dijite su n° de celular"
                            onKeyPress={keyNumberInteger}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Email</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            ref={this.refEmail}
                            value={this.state.email}
                            maxLength={30}
                            onChange={(event) =>
                              this.setState({ email: event.target.value })
                            }
                            placeholder="Dijite su email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <label>
                        Tipo <i className="text-danger fa fa-info-circle"></i>
                      </label>
                      <div className="form-group">
                        <select
                          className="form-control"
                          ref={this.refTipo}
                          value={this.state.tipo}
                          onChange={(event) =>
                            this.setState({ tipo: event.target.value })
                          }
                        >
                          <option value="">- Seleccione -</option>
                          <option value="1">ADMINISTRADOR</option>
                          <option value="2">CLIENTE</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Clave</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type={this.state.atribTypeClave}
                            ref={this.refClave}
                            value={this.state.clave}
                            maxLength={12}
                            onChange={(event) =>
                              this.setState({ clave: event.target.value })
                            }
                            placeholder="Dijite la contraseña"
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-primary"
                              type="button"
                              onMouseDown={this.watchPassword}
                              onMouseUp={this.watchPassword}
                              title="Ver clave"
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <label>
                        Tipo <i className="text-danger fa fa-info-circle"></i>
                      </label>
                      <div className="form-group">
                        <select
                          className="form-control"
                          ref={this.refEstado}
                          value={this.state.estado}
                          onChange={(event) =>
                            this.setState({ estado: event.target.value })
                          }
                        >
                          <option value="">- Seleccione -</option>
                          <option value="1">ACTIVO</option>
                          <option value="0">INACTIVO</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="row">
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <input
                              type="checkbox"
                              id="cbAdd"
                              checked={this.state.agregarUsuario}
                              onChange={(event) =>
                                this.setState({
                                  agregarUsuario: !this.state.agregarUsuario,
                                })
                              }
                            />
                            <label htmlFor="cbAdd">&nbsp;</label>Agregar Usuario
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <input
                              type="checkbox"
                              id="cbEdit"
                              checked={this.state.editarUsuario}
                              onChange={(event) =>
                                this.setState({
                                  editarUsuario: !this.state.editarUsuario,
                                })
                              }
                            />
                            <label htmlFor="cbEdit">&nbsp;</label>Editar Usuario
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <input
                              type="checkbox"
                              id="cbProcesar"
                              checked={this.state.procesarSaldo}
                              onChange={(event) =>
                                this.setState({
                                  procesarSaldo: !this.state.procesarSaldo,
                                })
                              }
                            />
                            <label htmlFor="cbProcesar">&nbsp;</label>Procesar
                            Saldo
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <input
                              type="checkbox"
                              id="cbVer"
                              checked={this.state.verSaldo}
                              onChange={(event) =>
                                this.setState({
                                  verSaldo: !this.state.verSaldo,
                                })
                              }
                            />
                            <label htmlFor="cbVer">&nbsp;</label>Ver Saldo
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <input
                              type="checkbox"
                              id="cbModulo"
                              checked={this.state.moduloReporte}
                              onChange={(event) =>
                                this.setState({
                                  moduloReporte: !this.state.moduloReporte,
                                })
                              }
                            />
                            <label htmlFor="cbModulo">&nbsp;</label>Modulo
                            Reporte
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 
                   <label>
                        Privilegios{" "}
                        <i className="text-danger fa fa-info-circle"></i>
                      </label>
                      <div class="form-group">
                        <input type="checkbox" id="cbLote" />
                        <label for="cbLote">&nbsp;</label>Agregar Usuario
                      </div>
                     */}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <button
                      onClick={() => this.editUser()}
                      className="btn btn-success"
                      type="button"
                      title="Guardar datos"
                    >
                      <i className="fa fa-save"></i> Guardar
                    </button>
                    <button
                      className="btn btn-danger ml-1"
                      type="button"
                      id="btnCancelCrudUser"
                      data-bs-dismiss="modal"
                      title="Cancelar"
                    >
                      <i className="fa fa-close"></i> Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalUpdateUsuario;
