import React from "react";
import { Link, withRouter } from "react-router-dom";

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="app-content">
        <div className="page-error tile">
          <h1>
            <i className="fa fa-exclamation-circle"></i> Error 404 página no
            encontrada
          </h1>
          <p>No se encuentra la página que ha solicitado.</p>
          <p>
            <button
              className="btn btn-outline-info"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fa fa-arrow-left"></i> Regresar
            </button>
          </p>
        </div>
      </main>
    );
  }
}

export default NotFound;
