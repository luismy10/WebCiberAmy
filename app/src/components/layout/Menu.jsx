import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { connect } from "react-redux";

const Menu = (props) => {
  const { usuario, privilegio } = props.token.userToken;

  return (
    <>
      <div className="app-sidebar__overlay" data-toggle="sidebar"></div>
      <aside className="app-sidebar">
        <div className="app-sidebar__user">
          <div className="m-2">
            <img className="img-fluid" src={logo} alt="User Image" />
          </div>

          <div className="m-1">
            <p className="app-sidebar__user-name">
              {usuario.tipo == 1 ? "ADMINISTRAR" : "CLIENTE"}
            </p>
          </div>
        </div>
        <ul className="app-menu">
          <li>
            <NavLink
              to="usuario"
              exact
              activeClassName="active"
              className="app-menu__item"
            >
              <i className="app-menu__icon fa fa-users"></i>
              <span className="app-menu__label">Usuarios</span>
            </NavLink>
          </li>
          {privilegio.moduloReporte == 1 ? (
            <li>
              <NavLink
                to="reporte"
                exact
                activeClassName="active"
                className="app-menu__item"
              >
                <i className="app-menu__icon fa fa-file-pdf-o"></i>
                <span className="app-menu__label">Reporte</span>
              </NavLink>
            </li>
          ) : null}
        </ul>
      </aside>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.reducer,
  };
};

export default connect(mapStateToProps)(Menu);
