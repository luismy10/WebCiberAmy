import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { signIn } from "../redux/actions";
import logo from "../assets/images/logo.png";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      idusuario: "",
      apellidos: "",
      nombres: "",
      correo: "",
      clave: "",
      errormessage: "",
    };

    this.refTxtEmail = React.createRef();
    this.refTxtClave = React.createRef();
  }

  async onEventForm() {
    if (this.state.loading) {
      return;
    }
    if (this.state.correo == "") {
      this.refTxtEmail.current.focus();
    } else if (this.state.clave == "") {
      this.refTxtClave.current.focus();
    } else {
      try {
        this.setState({ loading: true });
        const result = await axios.get("/api/usuario/login", {
          params: {
            usuario: this.state.correo.trim().toUpperCase(),
            clave: this.state.clave.trim().toUpperCase(),
            tipo: 1,
            token: "",
          },
        });

        // console.log(result.data);
        localStorage.setItem("login", JSON.stringify(result.data));
        this.props.restore(result.data);
      } catch (error) {
        this.setState({ loading: false });
        if (error.response != null || error.response != undefined) {
          this.setState({ errormessage: error.response.data }, () => {
            this.refTxtEmail.current.focus();
            this.refTxtEmail.current.value = "";
            this.refTxtClave.current.value = "";
          });
        } else {
          this.setState({ errormessage: "Error de cliente, ..." });
        }
      }
    }
  }

  render() {
    return (
      <>
        <section className="material-half-bg">
          <div className="cover"></div>
        </section>
        <section className="login-content">
          <div className="tile p-0">
            {this.state.loading ? (
              <div className="overlay " id="divOverlayLogin">
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
                <h4 className="l-text text-white" id="lblTextOverlayLogin">
                  Procesando Petición...
                </h4>
              </div>
            ) : null}

            <div className="tile-body">
              <div className="login-box">
                <div className="login-form">
                  <h4 className="text-center mb-3">
                    <img className="img-fluid" src={logo} alt="User Image" />
                  </h4>
                  <h4 className="login-head">
                    <i className="fa fa-lg fa-fw fa-user"></i>Credenciales de
                    Acceso
                  </h4>
                  <div className="form-group">
                    <label className="control-label">Email o Celular</label>
                    <input
                      className="form-control"
                      type="email"
                      value={this.state.correo}
                      placeholder="Dijite el email o celular"
                      ref={this.refTxtEmail}
                      maxLength={100}
                      autoFocus
                      onChange={(event) =>
                        this.setState({ correo: event.target.value })
                      }
                      onKeyPress={(event) => {
                        let code = event.charCode || event.which;
                        if (code === 13) {
                          this.onEventForm();
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="control-label">Contraseña</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Dijite la contraseña"
                      ref={this.refTxtClave}
                      maxLength={300}
                      onChange={(event) =>
                        this.setState({ clave: event.target.value })
                      }
                      onKeyPress={(event) => {
                        let code = event.charCode || event.which;
                        if (code === 13) {
                          this.onEventForm();
                        }
                      }}
                    />
                  </div>
                  <div className="form-group btn-container">
                    <button
                      onClick={() => this.onEventForm()}
                      className="btn btn-primary btn-block"
                    >
                      <i className="fa fa-sign-in fa-lg fa-fw"></i>ACEPTAR
                    </button>
                  </div>
                  <div className="form-group text-center">
                    <label
                      className="control-label text-danger"
                      id="lblErrorMessage"
                    >
                      {this.state.errormessage}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.reducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    restore: (user) => dispatch(signIn(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
