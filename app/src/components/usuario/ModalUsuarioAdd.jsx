import React, { Component } from "react";
import axios from "axios";
import {
  hideModal,
  ModalAlertSuccess,
  ModalAlertInfo,
  ModalAlertWarning,
  keyNumberInteger,
} from "../tools/Tools";

class ModalUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errormessage: "",
      atribTypeClave: "password",
      documento: "",
      informacion: "",
      celular: "",
      email: "",
      clave: "",
      tipo: "",
      estado: "1",
    };

    this.refDocumento = React.createRef();
    this.refInformacion = React.createRef();
    this.refCelular = React.createRef();
    this.refEmail = React.createRef();
    this.refTipo = React.createRef();
    this.refClave = React.createRef();
    this.refEstado = React.createRef();
  }

  saveUser = async () => {
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
    } else if (this.state.estado == "") {
      this.refEstado.current.focus();
    } else {
      try {
        ModalAlertInfo("Usuario", "Procesando petición...");
        hideModal("modalUsuario");
        const result = await axios.post("/api/usuario/add", {
          documento: this.state.documento.trim(),
          informacion: this.state.informacion.trim().toUpperCase(),
          celular: this.state.celular.trim(),
          email: this.state.email.trim(),
          clave: this.state.clave.trim(),
          token: "",
          tipo: this.state.tipo,
          estado: this.state.estado,
        });
        ModalAlertSuccess("Usuario", result.data);
      } catch (error) {
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
  };

  watchPassword = (event) => {
    if (event.type === "mousedown") {
      this.setState({ atribTypeClave: "text" });
    } else {
      this.setState({ atribTypeClave: "password" });
    }
  };

  cleanInput() {
    this.setState({
      errormessage: "",
      documento: "",
      informacion: "",
      celular: "",
      email: "",
      clave: "",
      tipo: "",
      estado: "1",
    });
  }

  render() {
    return (
      <div className="row">
        <div className="modal fade" id="modalUsuario" data-backdrop="static">
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
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label>
                        N° de Documento{" "}
                        <i className="text-danger fa fa-info-circle"></i>
                      </label>
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
                      <label>
                        Apellidos y Nombres{" "}
                        <i className="text-danger fa fa-info-circle"></i>
                      </label>
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
                      <label>
                        N° de Celular{" "}
                        <i className="text-danger fa fa-info-circle"></i>
                      </label>
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
                      <label>
                        Clave <i className="text-danger fa fa-info-circle"></i>
                      </label>
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
                </div>
              </div>

              <div className="modal-footer">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <button
                      onClick={this.saveUser}
                      className="btn btn-success"
                      type="button"
                      title="Guardar datos"
                    >
                      <i className="fa fa-save"></i> Guardar
                    </button>
                    <button
                      className="btn btn-danger ml-1"
                      type="button"
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

export default ModalUsuario;
