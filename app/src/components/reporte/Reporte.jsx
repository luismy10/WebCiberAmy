import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  showModal,
  hideModal,
  viewModal,
  clearModal,
  getCurrentDate,
  validateDate,
} from "../tools/Tools";
import loading from "../../assets/images/loading.gif";
// import SearchBar from "./SearchBar";

class Reporte extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idUsuario: "",
      fechaInicio: getCurrentDate(),
      fechaFinal: getCurrentDate(),
      messageModal: "",
      generate: false,
      dataFilter: [],
    };

    this.refFInicio = React.createRef();
    this.refFFinal = React.createRef();
    this.refModal = React.createRef();
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async componentDidMount() {
    viewModal("modalCliente", () => {
      this.refFInicio.current.focus();
    });
    clearModal("modalCliente", async () => {
      await this.setStateAsync({
        fechaInicio: getCurrentDate(),
        fechaFinal: getCurrentDate(),
        messageModal: "",
        generate: false,
      });
    });
  }

  componentDidMount() {}
  openModalCliente() {
    showModal("modalCliente");
  }

  async onEventTransaccion() {
    if (!validateDate(this.state.fechaInicio)) {
      this.refFInicio.current.focus();
      await this.setStateAsync({
        messageModal: "Ingrese la fecha de inicio",
      });
    } else if (!validateDate(this.state.fechaFinal)) {
      this.refFFinal.current.focus();
      await this.setStateAsync({
        messageModal: "Ingrese la fecha de inicio",
      });
    } else {
      try {
        await this.setStateAsync({
          generate: true,
        });
        let result = await axios.get("/documents/pdf/transacciones", {
          responseType: "blob",
          params: {
            fechaInicio: this.state.fechaInicio,
            fechaFinal: this.state.fechaFinal,
          },
        });

        const file = new Blob([result.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        if (this.refModal.current != null) {
          await await this.setStateAsync({
            messageModal: "",
            generate: false,
          });
        }
      } catch (error) {
        if (this.refModal.current != null) {
          await await this.setStateAsync({
            messageModal:
              "Se produjo un error interno, comuníquese con su proveedor.",
            generate: false,
          });
        }
      }
    }
  }

  onChangeIdUsuario = async (idUsuario) => {
    await this.setStateAsync({ idUsuario: idUsuario });
  };

  render() {
    return (
      <>
        {/*  */}
        <div className="row">
          <div
            className="modal fade"
            id="modalCliente"
            data-bs-backdrop="static"
            ref={this.refModal}
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    <i className="fa fa-th-large"></i> Clientes
                  </h4>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <label>Fecha de Inicio:</label>
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="date"
                          ref={this.refFInicio}
                          value={this.state.fechaInicio}
                          onChange={(event) => {
                            if (event.target.value.length > 0) {
                              this.setState({
                                fechaInicio: event.target.value,
                                messageModal: "",
                              });
                            } else {
                              this.setState({
                                fechaInicio: event.target.value,
                                messageModal: "Ingrese la fecha de inicio",
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <label>Fecha de Fin:</label>
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="date"
                          ref={this.refFFinal}
                          value={this.state.fechaFinal}
                          onChange={(event) => {
                            if (event.target.value.length > 0) {
                              this.setState({
                                fechaFinal: event.target.value,
                                messageModal: "",
                              });
                            } else {
                              this.setState({
                                fechaFinal: event.target.value,
                                messageModal: "Ingrese la fecha de fin",
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {this.state.messageModal !== "" ? (
                    <div className="bs-component">
                      <div className="alert alert-dismissible alert-warning mb-0">
                        <h4>Warning!</h4>
                        <p>{this.state.messageModal}</p>
                      </div>
                    </div>
                  ) : null}

                  {this.state.generate ? (
                    <div className="bs-component">
                      <div className="alert alert-dismissible alert-success mb-0">
                        <strong>Generando Reporte!</strong>
                        <p className="alert-link">
                          Espere que se complete el proceso{" "}
                          <img src={loading} alt="Loading..." width="32" />
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <label>Usuario:</label>
                      <SearchBar
                        placeholder="Escribe para iniciar a filtrar..."
                        onChangeIdUsuario={this.onChangeIdUsuario}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.onEventTransaccion()}
                  >
                    <i className="text-danger fa fa-file-pdf-o"></i> Generar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    <i className="fa fa-remove"></i> Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}

        <main className="app-content">
          <div className="app-title">
            <h1>
              <i className="fa fa-folder"></i> Reporte <small>Lista</small>
            </h1>
          </div>

          <div className="tile">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-12 col-12">
                <div className="card mb-3 card-default">
                  <button
                    className="btn btn-link"
                    onClick={() => this.openModalCliente()}
                  >
                    <h5 className="card-title">Clientes</h5>
                    <div className="card-body">
                      <i className="fa fa-file-pdf-o fa-3x"></i>
                    </div>
                    <div className="card-footer border-0">Documento</div>
                  </button>
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

export default connect(mapStateToProps)(Reporte);
