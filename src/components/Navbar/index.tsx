import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { MenuProps } from "semantic-ui-react";
import { createToastNotify } from "../../helpers/createToast";

import {
  StyledButton,
  StyledButtonContent,
  StyledIcon,
  StyledMenu,
  StyledMenuItem,
  StyledSegment,
  Title,
} from "./styles";

const Navbar = () => {
  const history = useHistory();

  const handleItemClick = (e: MenuProps, { path }: MenuProps) => {
    history.push(`${path}`);
  };

  const handleActualPathRoute = (pathRoute: string) => {
    return history.location.pathname === pathRoute;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    createToastNotify("Você foi deslogado!", toast.warn);
    history.push("/");
  };

  return (
    <StyledSegment inverted color="teal">
      <StyledMenu inverted secondary fluid stackable widths="4">
        <StyledMenuItem color="blue" children={<Title>BAGUG S1TES</Title>} />

        <StyledMenuItem
          name="Listagem"
          path="/listagem"
          color="blue"
          active={handleActualPathRoute("/listagem")}
          onClick={handleItemClick}
        />
        <StyledMenuItem
          name="Formulário"
          path="/formulario"
          color="blue"
          active={handleActualPathRoute("/formulario")}
          onClick={handleItemClick}
        />

        <StyledMenu.Menu position="right">
          <StyledButton animated="fade" onClick={handleLogout} color="teal">
            <StyledButtonContent visible>Logout</StyledButtonContent>
            <StyledButtonContent hidden>
              <StyledIcon name="sign-out" size="large" />
            </StyledButtonContent>
          </StyledButton>
        </StyledMenu.Menu>
      </StyledMenu>
    </StyledSegment>
  );
};

export default Navbar;
