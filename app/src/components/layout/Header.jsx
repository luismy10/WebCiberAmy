import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../redux/actions";
import usuario from "../../assets/images/usuario.png";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  onEventSignIn = async (event) => {
    try {
      localStorage.removeItem("login");
      this.props.restore();
    } catch (e) {
      this.props.restore();
    }
  };

  render() {
    const { documento, informacion } = this.props.token.userToken.usuario;

    return (
      <header className="app-header">
        <Link to="/" className="app-header__logo">
          SysSoft Integra
        </Link>

        <a
          className="app-sidebar__toggle"
          href="#"
          data-toggle="sidebar"
          aria-label="Hide Sidebar"
        ></a>

        <ul className="app-nav">
          <li className="dropdown">
            <a
              className="app-nav__item"
              href="#"
              data-bs-toggle="dropdown"
              aria-label="Show notifications"
            >
              <i className="fa fa-bell-o fa-sm"></i>
              <span
                id="lblNumeroNotificaciones"
                className="pl-1 pr-1 badge-warning rounded h7 icon-absolute "
              >
                0
              </span>
            </a>
            <ul className="app-notification dropdown-menu dropdown-menu-right">
              <div
                className="app-notification__content"
                id="divNotificaciones"
              ></div>
              <li className="app-notification__footer" id="lblNotificaciones">
                <span>Lista de Notificaciones</span>
              </li>
            </ul>
          </li>

          <li className="dropdown">
            <button
              type="button"
              className="btn app-nav__item"
              data-bs-toggle="dropdown"
              aria-label="Open Profile Menu"
            >
              <img src={usuario} className="user-image" alt="Usuario" />
            </button>
            <ul className="dropdown-menu settings-menu dropdown-menu-right">
              <li className="user-header">
                <img src={usuario} className="img-circle" alt="Usuario" />
                <p>
                  <span>{documento}</span>
                  <small>
                    {" "}
                    <i>{informacion}</i>{" "}
                  </small>
                </p>
              </li>
              <li className="user-footer">
                <div className="pull-left">
                  <a href="perfil.php" className="btn btn-secondary btn-flat">
                    <i className="fa fa-user fa-sm"></i> Perfil Usuario
                  </a>
                </div>
                <div className="pull-right">
                  <button
                    onClick={this.onEventSignIn}
                    id="btnCloseSesion"
                    className="btn btn-secondary btn-flat"
                  >
                    <i className="fa fa-sign-out fa-sm"></i> Cerrar Sesión
                  </button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </header>
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
    restore: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
