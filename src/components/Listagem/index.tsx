import React, { useEffect, useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import {
  Header,
  HtmlInputrops,
  SearchResultData,
  SearchResultsProps,
} from "semantic-ui-react";
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
  StyledSearch,
  StyledModal,
  StyledModalActions,
  StyledModalContent,
} from "./styles";

import Navbar from "../Navbar";
import { UserShape, ShapedUsers } from "./types";
import { createToastNotify } from "../../helpers/createToast";

const UserInitialState = {
  id: "",
  nome: "",
  cpf: "",
  email: "",
  endereco: {
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
  },
};

const Listagem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalResult, setModalResult] = useState<UserShape>(UserInitialState);

  const [users, setUsers] = useState<UserShape[]>([]);
  const [allUsers, setAllUsers] = useState<UserShape[]>([]);
  const [resultUsers, setResultUsers] = useState<ShapedUsers[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      setIsChanged(true);
      setIsOpen(false);
      createToastNotify("Usuário deletado com sucesso!", toast.success);
      handlePopulateUsersLength();
    } catch (err) {
      createToastNotify("Houve um erro ao tentar deletar!", toast.error);
    }
  };

  const handleEditUser = (userID: string) => {
    history.push(`/formulario/${userID}`);
    setIsOpen(false);
  };

  const handlePageChange = (e: any, { activePage }: any) => {
    setLoadingNewPage(true);
    setActivePage(activePage);
  };

  const handlePopulateUsersLength = async () => {
    try {
      const { data } = await Axios.get("http://localhost:5000/usuarios");
      setIsLoading(false);
      setDeleted(false);
      setAllUsers(data);
      setTotalTablePages(Math.ceil(data.length / 5));
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
      // setIsLoading(false);
      // setDeleted(false);
      setLoadingNewPage(false);
    } catch (ex) {
      setDeleted(false);
      setLoadingNewPage(false);
      createToastNotify(
        "Não foi possível carregar mais usuários!",
        toast.error
      );
      console.log(ex);
    }
  };

  const handleSearchChange = (e: HtmlInputrops) => {
    setSearchTerm(e.target.value);

    const filteredUsers = allUsers.filter((user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const newUsers = filteredUsers.map((user) => {
      return {
        title: user.nome,
        description: user.email,
        price: user.cpf,
        image: <StyledIcon name="user" size="big" />,
      };
    });

    setResultUsers([...newUsers]);
    console.log(filteredUsers);
  };

  const handleResultSelect = (
    e: SearchResultsProps,
    data: SearchResultData
  ) => {
    setIsOpen(true);
    const userData =
      allUsers.find((user) => user.cpf === data.result.price) ||
      UserInitialState;
    setModalResult(userData);
  };

  useEffect(() => {
    handlePopulateUsersFromAPI();
    setIsChanged(false);
    setSearchTerm("");

    if (totalTablePages === 0) {
      handlePopulateUsersLength();
    }
  }, [isChanged, activePage]);
  return (
    <Container>
      <Navbar />

      <StyledModal
        closeIcon
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
      >
        <Header icon="user" content="Archive Old Messages" />
        <StyledModalContent
          style={{ display: "flex", justifyContent: "center" }}
        >
          <StyledTable>
            <StyledHeader>
              <StyledRow>
                <StyledHeaderCell>Nome</StyledHeaderCell>
                <StyledHeaderCell>CPF</StyledHeaderCell>
                <StyledHeaderCell>E-mail</StyledHeaderCell>
                <StyledHeaderCell>Cidade</StyledHeaderCell>
              </StyledRow>
            </StyledHeader>
            <StyledBody>
              <StyledRow disabled={deleted}>
                <StyledCell>{modalResult?.nome}</StyledCell>
                <StyledCell>{modalResult?.cpf}</StyledCell>
                <StyledCell>{modalResult?.email}</StyledCell>
                <StyledCell>{modalResult?.endereco.cidade}</StyledCell>
              </StyledRow>
            </StyledBody>
          </StyledTable>
        </StyledModalContent>

        <StyledModalActions>
          <StyledButton
            color="blue"
            disabled={deleted}
            onClick={() => handleEditUser(modalResult.id)}
          >
            <StyledIcon name="pencil" /> Editar
          </StyledButton>
          <StyledButton
            color="red"
            disabled={deleted}
            onClick={() => handleDeleteUser(modalResult.id)}
          >
            <StyledIcon name="trash" /> Deletar
          </StyledButton>
        </StyledModalActions>
      </StyledModal>

      <StyledSearch
        fluid
        disabled={isLoading || deleted}
        loading={isLoading}
        value={searchTerm}
        results={resultUsers}
        onSearchChange={handleSearchChange}
        onResultSelect={handleResultSelect}
      />

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
                  onClick={() => handleEditUser(user.id)}
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
          disabled={loadingNewPage || deleted}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default Listagem;
