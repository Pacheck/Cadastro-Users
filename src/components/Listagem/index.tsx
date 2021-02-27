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
  StyledPagination,
} from "./styles";

import { createToastNotify } from "../../helpers/createToast";
import { toast } from "react-toastify";
import Navbar from "../Navbar";
import { IUserShape } from "./types";

const Listagem = () => {
  const [users, setUsers] = useState<IUserShape[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [totalTablePages, setTotalTablePages] = useState(0);
  const [loadingNewPage, setLoadingNewPage] = useState(false);

  const history = useHistory();

  const handleNavigateToForm = () => history.push("/formulario");

  const handleDeleteUser = async (id: string) => {
    try {
      setDeleted(true);
      await Axios.delete(`http://localhost:5000/usuarios/${id}`);
      createToastNotify("Usuário deletado com sucesso!", toast.success);
      handlePopulateUsersLength();
      setIsChanged(true);
    } catch (err) {
      createToastNotify("Houve um erro ao tentar deletar!", toast.error);
    }
  };

  const handlePageChange = (e: any, { activePage }: any) => {
    setLoadingNewPage(true);
    setActivePage(activePage);
  };

  const handlePopulateUsersLength = async () => {
    try {
      const { data: usersLength } = await Axios.get(
        "http://localhost:5000/usuarios"
      );
      setTotalTablePages(Math.ceil(usersLength.length / 5));
    } catch (ex) {
      createToastNotify(
        "Não foi possível carregar os dados do banco!",
        toast.error
      );
    }
  };

  const handlePopulateUsersFromAPI = async () => {
    try {
      if (isLoading) createToastNotify("Carregando dados..", toast.info);
      const response = await Axios.get(
        `http://localhost:5000/usuarios?_page=${activePage}&_limit=5`
      );
      setUsers(response.data);
      setIsLoading(false);
      setLoadingNewPage(false);
      setDeleted(false);
    } catch (ex) {
      createToastNotify(
        "Não foi possível carregar mais usuários!",
        toast.error
      );
      console.log(ex);
    }
  };

  useEffect(() => {
    handlePopulateUsersFromAPI();
    setIsChanged(false);

    if (totalTablePages === 0) {
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
            <StyledHeaderCell>
              {!isLoading && (
                <StyledButton
                  labelPosition="left"
                  size="large"
                  positive
                  icon
                  onClick={handleNavigateToForm}
                >
                  <StyledIcon name="user" /> Adicionar Usuário
                </StyledButton>
              )}
            </StyledHeaderCell>
          </StyledRow>
        </StyledHeader>

        <StyledBody>
          {users.map((user) => (
            <StyledRow disabled={deleted || loadingNewPage} key={user.id}>
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
                  <StyledIcon name="pencil" size="small" />
                  Edit
                </StyledButton>
                <StyledButton
                  icon
                  negative
                  labelPosition="left"
                  size="small"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <StyledIcon name="trash" size="small" />
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
            <StyledHeaderCell colSpan={4}>
              <StyledLoader active={loadingNewPage || deleted} inline />
            </StyledHeaderCell>
            <StyledHeaderCell colSpan={6}></StyledHeaderCell>
          </StyledRow>
        </StyledFooter>
      </StyledTable>
      {totalTablePages > 0 && (
        <StyledPagination
          activePage={activePage}
          totalPages={totalTablePages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default Listagem;
