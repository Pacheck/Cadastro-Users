import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { createToastNotify } from "../Login/helpers/createToast";

import { Container } from "./styles";

const Navbar = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("token");

    createToastNotify("Você foi deslogado!", toast.warn);

    history.push("/");
  };

  return (
    <Container>
      <h1>Navbar</h1>
      <ul>
        <li onClick={() => history.push("/listagem")}>Listagem</li>
        <li onClick={() => history.push("/formulario")}>Formulario</li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </Container>
  );
};

export default Navbar;
