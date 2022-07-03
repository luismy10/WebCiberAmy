import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./assets/js/jquery";
import "./assets/js/bootstrap";
import "./assets/js/pace.min";
import { connect } from "react-redux";
import { restoreToken } from "./redux/actions";

import Header from "./components/layout/Header";
import Menu from "./components/layout/Menu";
import Main from "./assets/js/main";
import Home from "./components/Home";
import Usuario from "./components/usuario/Usuario";
import Transaccion from "./components/transaccion/Transaccion";
import Reporte from "./components/reporte/Reporte";
import NotFound from "./components/error/NotFound";
import Login from "./components/Login";

const Loader = () => {
  return <div>Cargando....</div>;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    try {
      let userToken = localStorage.getItem("login");
      this.props.restore(JSON.parse(userToken));
    } catch (e) {
      this.props.restore(null);
    }
  }

  componentDidUpdate() {
    Main();
  }

  render() {
    return (
      <BrowserRouter>
        {this.props.token.isLoading ? (
          <Loader />
        ) : this.props.token.userToken == null ? (
          <Login />
        ) : (
          <>
            <Header />
            <Menu />
            <Switch>
              <Route path="/" name="home" exact={true} component={Home} />
              <Route
                path="/usuario"
                name="usuario"
                exact={true}
                render={(props) => <Usuario {...props} />}
              />
              <Route
                path="/transaccion"
                name="transaccion"
                exact={true}
                render={(props) => <Transaccion {...props} />}
              />
              <Route
                path="/reporte"
                name="reporte"
                exact={true}
                render={(props) => <Reporte {...props} />}
              />

              <Route component={NotFound} />
            </Switch>
          </>
        )}
      </BrowserRouter>
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
    restore: (user) => dispatch(restoreToken(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
