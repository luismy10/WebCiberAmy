import React from "react";
import {
  hideModal,
  ModalAlertInfo,
  ModalAlertSuccess,
  ModalAlertWarning,
  keyNumberFloat,
} from "../tools/Tools";
import axios from "axios";

class ModalTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idUsuario: "",
      tipo: "",
      monto: "",
      comentario: "",
    };
    this.refTipo = React.createRef();
    this.refMonto = React.createRef();
    this.refComentario = React.createRef();
  }

  loadData(id) {
    this.setState({ idUsuario: id });
  }

  async onEventTransaccion() {
    if (this.state.tipo === "") {
      this.refTipo.current.focus();
    } else if (this.state.monto === "") {
      this.refMonto.current.focus();
    } else {
      try {
        ModalAlertInfo("Transacción", "Procesando petición...");
        hideModal("modalTransaccion");
        let result = await axios.post("/api/transaccion/add", {
          tipo: this.state.tipo,
          monto: this.state.monto,
          comentario: this.state.comentario,
          idUsuario: this.state.idUsuario,
        });
        ModalAlertSuccess("Transacción", result.data);
      } catch (error) {
        if (error.response != null || error.response != undefined) {
          ModalAlertWarning("Transacción", error.response.data);
        } else {
          ModalAlertWarning(
            "Transacción",
            "Se produjo un error interno, intente nuevamente por favor."
          );
        }
      }
    }
  }

  cleanInput() {
    this.setState({
      idUsuario: "",
      tipo: "",
      monto: "",
      comentario: "",
    });
  }

  render() {
    return (
      <div className="row">
        <div
          className="modal fade"
          id="modalTransaccion"
          data-backdrop="static"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <i className="fa fa-money"></i> Agregar o Restar Saldo
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
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Tipo</label>
                        <div className="input-group">
                          <select
                            className="form-control"
                            value={this.state.tipo}
                            onChange={(event) =>
                              this.setState({ tipo: event.target.value })
                            }
                            ref={this.refTipo}
                          >
                            <option value="">- Seleccione -</option>
                            <option value="1">Agregar &#10133;</option>
                            <option value="0">Restar &#10134;</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Monto</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="0.00"
                            value={this.state.monto}
                            onChange={(event) =>
                              this.setState({ monto: event.target.value })
                            }
                            ref={this.refMonto}
                            onKeyPress={keyNumberFloat}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Comentario</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Ingrese algún comentario"
                            value={this.state.comentario}
                            onChange={(event) =>
                              this.setState({ comentario: event.target.value })
                            }
                            ref={this.refComentario}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <button
                      className="btn btn-success"
                      type="button"
                      title="Guardar datos"
                      onClick={() => this.onEventTransaccion()}
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

export default ModalTransition;
