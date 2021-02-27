import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import {
  Container,
  StyledTable,
  StyledButton,
  StyledIcon,
  StyledFooter,
  StyledLoader,
  StyledRow,
  StyledHeaderCell,
  StyledHeader,
  StyledBody,
  StyledCell,
} from "./styles";

import { IUserShape } from "./types";
import Navbar from "../Navbar";
import { createToastNotify } from "../../helpers/createToast";
import { toast } from "react-toastify";
import { Pagination } from "semantic-ui-react";

const Listagem = () => {
  const [users, setUsers] = useState<IUserShape[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [totalTablePages, setTotalTablePages] = useState(1);

  const history = useHistory();

  const handleNavigateToForm = () => history.push("/formulario");

  const handleDeleteUser = async (id: string) => {
    try {
      setIsChanged(true);
      setDeleted(true);
      const response = await Axios.delete(
        `http://localhost:5000/usuarios/${id}`
      );
      createToastNotify("Usuário deletado com sucesso!", toast.success);
    } catch (err) {
      createToastNotify("Houve um erro ao tentar deletar!", toast.error);
    }
  };

  const handlePageChange = (e: any) => {
    setActivePage(e.target.text);
  };

  const handlePopulateUsersLength = async () => {
    try {
      const { data: databaseLength } = await Axios.get(
        "http://localhost:5000/usuarios"
      );

      setTotalTablePages(Math.ceil(databaseLength.length / 5));
      console.log(databaseLength.length);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handlePopulateUsersFromAPI = async () => {
    const response = await Axios.get(
      `http://localhost:5000/usuarios?_page=${activePage}&_limit=5`
    );
    setTotalTablePages(Math.ceil(response.data.length));
    setUsers(response.data);
    setIsLoading(false);
    setDeleted(false);
    console.log(response);
  };

  useEffect(() => {
    handlePopulateUsersFromAPI();
    setIsChanged(false);
    if (totalTablePages !== 0) {
      handlePopulateUsersLength();
    }
  }, [isChanged, activePage]);
  return (
    <Container>
      <Navbar />

      <StyledTable stackable selectable singleLine>
        <StyledHeader>
          <StyledRow>
            <StyledHeaderCell>Nome</StyledHeaderCell>
            <StyledHeaderCell>CPF</StyledHeaderCell>
            <StyledHeaderCell>E-mail</StyledHeaderCell>
            <StyledHeaderCell>Cidade</StyledHeaderCell>
            <StyledHeaderCell />
          </StyledRow>
        </StyledHeader>

        <StyledBody>
          {users.map((user) => (
            <StyledRow disabled={deleted} key={user.id}>
              <StyledCell>{user.nome}</StyledCell>
              <StyledCell>{user.cpf}</StyledCell>
              <StyledCell>{user.email}</StyledCell>
              <StyledCell>{user.endereco.cidade}</StyledCell>
              <StyledCell>
                <StyledButton
                  icon
                  primary
                  labelPosition="left"
                  size="small"
                  onClick={() => history.push(`/formulario/${user.id}`)}
                >
                  <StyledIcon name="pencil" size="md" />
                  Edit
                </StyledButton>
                <StyledButton
                  icon
                  negative
                  labelPosition="left"
                  size="small"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <StyledIcon name="trash" size="md" />
                  Delete
                </StyledButton>
              </StyledCell>
            </StyledRow>
          ))}
          {isLoading && (
            <StyledRow disabled={isLoading}>
              <StyledCell colSpan={5}>
                <StyledLoader
                  size="big"
                  active={isLoading}
                  inline="centered"
                  floated="center"
                />
              </StyledCell>
            </StyledRow>
          )}
        </StyledBody>

        <StyledFooter>
          <StyledRow>
            <StyledHeaderCell colSpan={5} verticalAlign="center">
              <StyledButton
                labelPosition="left"
                size="larger"
                positive
                icon
                disabled={isLoading}
                onClick={handleNavigateToForm}
              >
                <StyledIcon name="user" /> Adicionar Usuário
              </StyledButton>
            </StyledHeaderCell>
          </StyledRow>
        </StyledFooter>
      </StyledTable>
      <Pagination
        showEllipsis
        showPreviousAndNextNav
        activePage={activePage}
        totalPages={totalTablePages}
        onPageChange={handlePageChange}
      />
      <StyledLoader active={deleted} inline="centered" />
    </Container>
  );
};

export default Listagem;
