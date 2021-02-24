import React from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { PrivateProps } from "./types";
import Login from "../components/Login";
import Listagem from "../components/Listagem";
import Formulario from "../components/Formulario";

function PrivateRoute(props: PrivateProps) {
  const { children, ...rest } = props;
  return (
    <Route
      {...rest}
      render={() => {
        return localStorage.getItem("token") ? children : <Redirect to="/" />;
      }}
    />
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <PrivateRoute exact path="/listagem" children={<Listagem />} />
        <PrivateRoute exact path="/formulario" children={<Formulario />} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
