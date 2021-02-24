import React, { useEffect, useState } from "react";
import Axios from "axios";

import { Container, Table } from "./styles";
import Navbar from "../Navbar";

import { IUserShape } from "./types";

const Listagem = () => {
  const [users, setUsers] = useState<IUserShape[]>([]);

  useEffect(() => {
    const getDataFromAPI = async () => {
      await Axios.get("http://localhost:5000/usuarios").then((res) =>
        setUsers(res.data)
      );
    };
    getDataFromAPI();
  }, []);

  console.log(users);

  return (
    <Container>
      <Navbar />
      <h1>Listagem de usuários</h1>
      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={Math.random() * 999}>
                <td>{user.nome}</td>
                <td>{user.cpf}</td>
                <td>{user.email}</td>
                <td>{user.endereco.cidade}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Listagem;
