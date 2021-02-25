import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { validateCPF } from "../../helpers/validateCPF";
import { createToastNotify } from "../../helpers/createToast";
import { validateEmail } from "../../helpers/validateEmail";
import { validateCEP } from "../../helpers/validateCEP";
import { fetchCEP } from "../../helpers/fetchCEP";

import { IEndereco, IFetchResponseData, IFormValues } from "./types";
import Navbar from "../Navbar";
import {
  Container,
  StyledForm,
  StyledFormButton,
  FormField,
  InputForm,
  StyledGroup,
  StyledGrid,
} from "./styles";
import { Grid, Message } from "semantic-ui-react";
import axios from "axios";

const enderecoInitialState: IEndereco = {
  logradouro: "",
  localidade: "",
  complemento: "",
  bairro: "",
};

const personalInfoInitialState = {
  cpf: "",
  cep: "",
};

const Formulario = () => {
  const [personalInfo, setPersonalInfo] = useState(personalInfoInitialState);
  const [isFetched, setIsFetched] = useState(false);
  const [currentFetchedCep, setCurrentFetchedCep] = useState("");
  const [endereco, setEndereco] = useState(enderecoInitialState);
  const [formBehavior, setFormBehavior] = useState({
    success: false,
    error: false,
  });
  const { register, handleSubmit, errors, reset } = useForm<IFormValues>();

  const handleValidateUserData = (data: IFormValues) => {
    try {
      console.log(data);
      if (data) {
        const { nome, cpf, email, cep, cidade, bairro, rua, numero } = data;
        const user = {
          id: uuidv4(),
          nome,
          cpf,
          email,
          cep,
          endereco: { cidade, bairro, rua, numero },
        };
        axios.post("http://localhost:5000/usuarios", user);
        setFormBehavior({ error: false, success: true });
        setPersonalInfo(personalInfoInitialState);
        handleCleanupForm();
      } else {
        setFormBehavior({ error: true, success: false });
      }
    } catch (e) {
      createToastNotify("Houve um erro com seus dados!", toast.warn);
      setFormBehavior({ error: true, success: false });
    }
  };

  const handleUpdateCPF = (e: any) => {
    setPersonalInfo({ ...personalInfo, cpf: validateCPF(e.target.value) });
  };

  const handleUpdateCep = (e: any) => {
    setPersonalInfo({ ...personalInfo, cep: validateCEP(e.target.value) });
  };

  const handleCleanupForm = () => {
    reset();
    setEndereco(enderecoInitialState);
  };

  const handleFetchCEP = async () => {
    const fetchedCEP = await fetchCEP(personalInfo.cep, currentFetchedCep);
    const {
      newCep,
      logradouro,
      localidade,
      bairro,
      complemento,
      isFetched,
    }: IFetchResponseData | any = fetchedCEP;

    setEndereco({ logradouro, localidade, bairro, complemento });
    setIsFetched(isFetched);
    setCurrentFetchedCep(newCep);
  };

  const handleFormErrors = () => {
    if (errors.nome)
      createToastNotify("O campo nome é obrigatório!", toast.error);
    if (errors.cpf)
      createToastNotify("O campo cpf é obrigatório!", toast.error);
    if (errors.email)
      createToastNotify("O campo e-mail é obrigatório!", toast.error);
    if (errors.cep)
      createToastNotify("O campo cep é obrigatório!", toast.error);
  };

  return (
    <Container>
      <Navbar />
      <StyledForm
        success={formBehavior.success}
        error={formBehavior.error}
        onSubmit={handleSubmit(handleValidateUserData)}
      >
        <StyledGrid>
          <Grid.Column computer={10} tablet={13} mobile={13}>
            <FormField>
              <label htmlFor="nome">Nome</label>
              <InputForm
                name="nome"
                autoFocus
                defaultValue=""
                ref={register({
                  required: true,
                  minLength: 10,
                  maxLength: 100,
                })}
              />
            </FormField>

            <FormField>
              <label htmlFor="cpf">CPF</label>
              <InputForm
                name="cpf"
                value={personalInfo.cpf}
                placeholder="xxx.xxx.xxx-xx"
                onChange={handleUpdateCPF}
                ref={register({ required: true, minLength: 11, maxLength: 14 })}
              />
            </FormField>

            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="email">E-mail</label>
                <InputForm
                  name="email"
                  defaultValue=""
                  placeholder="example@gmail.com"
                  ref={register({ required: true })}
                />
              </FormField>

              <FormField>
                <label htmlFor="cep">CEP</label>
                <InputForm
                  name="cep"
                  value={personalInfo.cep}
                  placeholder="xxxxx-xxx"
                  ref={register({ required: true, minLength: 8 })}
                  maxLength={9}
                  onChange={handleUpdateCep}
                  onBlur={handleFetchCEP}
                />
              </FormField>
            </StyledGroup>
          </Grid.Column>

          <Grid.Column computer={10} tablet={13} mobile={13}>
            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="rua">Rua</label>
                <InputForm
                  name="rua"
                  value={endereco.logradouro}
                  ref={register({ required: true })}
                  readOnly={isFetched}
                />
              </FormField>

              <FormField>
                <label htmlFor="numero">Número</label>
                <InputForm
                  name="numero"
                  value={endereco.complemento}
                  ref={register()}
                  readOnly={isFetched}
                />
              </FormField>
            </StyledGroup>
            {/* /////////////////////   */}
            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="bairro">Bairro</label>
                <InputForm
                  name="bairro"
                  value={endereco.bairro}
                  ref={register({ required: true })}
                  readOnly={isFetched}
                />
              </FormField>

              <FormField>
                <label htmlFor="cidiade">Cidade</label>
                <InputForm
                  name="cidade"
                  value={endereco.localidade}
                  ref={register({ required: true })}
                  readOnly={isFetched}
                />
              </FormField>
            </StyledGroup>
            <Message
              success
              header="Sucesso!"
              content="Seus dados foram enviados."
            />
            <Message
              error
              header="Error!"
              content="Não foi possível enviar os dados."
            />
            <StyledFormButton
              fluid
              positive
              type="submit"
              onClick={handleFormErrors}
            >
              Enviar
            </StyledFormButton>
          </Grid.Column>
        </StyledGrid>
        <Grid></Grid>
      </StyledForm>
    </Container>
  );
};

export default Formulario;
