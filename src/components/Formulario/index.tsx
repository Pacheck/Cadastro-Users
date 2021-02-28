import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { Grid, Label, Message } from "semantic-ui-react";
import { createToastNotify } from "../../helpers/createToast";
import { maskCEP } from "../../helpers/maskCEP";
import { maskCPF } from "../../helpers/maskCPF";
import { validateEmailRegex } from "../../helpers/validateEmail";
import { fetchCEP } from "../../helpers/fetchCEP";
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
import {
  IEndereco,
  IFetchResponseData,
  IFormValues,
  IUserParams,
} from "./types";

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

const clearedUserData: IFormValues = {
  nome: "",
  cpf: "",
  email: "",
  cep: "",
  bairro: "",
  cidade: "",
  numero: "",
  rua: "",
};

const Formulario = () => {
  const { userId } = useParams<IUserParams>();

  const [personalInfo, setPersonalInfo] = useState(personalInfoInitialState);
  const [isFetched, setIsFetched] = useState(false);
  const [currentFetchedCep, setCurrentFetchedCep] = useState("");
  const [endereco, setEndereco] = useState(enderecoInitialState);
  const [formBehavior, setFormBehavior] = useState({
    success: false,
    error: false,
  });
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
  } = useForm<IFormValues>();

  const handleSubmitForm = (data: IFormValues) => {
    try {
      console.log(data);
      if (data) {
        const { nome, cpf, email, cep, cidade, bairro, rua, numero } = data;
        const user = {
          id: userId ? userId : uuidv4(),
          nome,
          cpf,
          email,
          endereco: { cep, cidade, bairro, rua, numero },
        };
        userId
          ? axios.put(`http://localhost:5000/usuarios/${userId}`, user)
          : axios.post("http://localhost:5000/usuarios", user);

        setFormBehavior({ error: false, success: true });
        handleCleanupForm(clearedUserData);
      } else {
        setFormBehavior({ error: true, success: false });
      }
    } catch (e) {
      createToastNotify("Houve um erro com seus dados!", toast.warn);
      setFormBehavior({ error: true, success: false });
    }
  };

  const handleUpdateCPF = (e: any) => {
    setValue("cpf", maskCPF(e.target.value));
    setPersonalInfo({ ...personalInfo, cpf: maskCPF(e.target.value) });
  };

  const handleUpdateNumero = (e: any) => {
    setValue("numero", e.target.value);
    setEndereco({ ...endereco });
  };

  const handleUpdateCep = (e: any) => {
    setPersonalInfo({ ...personalInfo, cep: maskCEP(e.target.value) });
    setValue("cep", maskCEP(e.target.value));
    if (e.target.value.length === 9) {
      handleFetchCEP(e.target.value);
    }
  };

  const handleCleanupForm = (formData: IFormValues) => {
    reset({ ...formData });
    setPersonalInfo(personalInfoInitialState);
    setEndereco(enderecoInitialState);
  };

  const handleFetchCEP = async (autoCompletedCEP?: string) => {
    try {
      const cepToFetch = autoCompletedCEP ? autoCompletedCEP : personalInfo.cep;
      const fetchedCEP = await fetchCEP(cepToFetch, currentFetchedCep);
      console.log(fetchedCEP);
      const {
        newCep,
        logradouro,
        localidade,
        bairro,
        isFetched,
      }: IFetchResponseData | any = fetchedCEP;
      setCurrentFetchedCep(newCep);
      setValue("rua", logradouro);
      setValue("bairro", bairro);
      setValue("cidade", localidade);
      setIsFetched(isFetched);
      setFormBehavior({ success: false, error: false });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFetchUserID = async () => {
    if (userId) {
      const res = await axios.get(`http://localhost:5000/usuarios/${userId}`);
      handleCleanupForm({
        nome: res.data.nome,
        email: res.data.email,
        cpf: res.data.cpf,
        cep: res.data.endereco.cep,
        bairro: res.data.endereco.bairro,
        rua: res.data.endereco.rua,
        numero: res.data.endereco.numero,
        cidade: res.data.endereco.cidade,
      });
      console.log(res);
    }
    return;
  };

  useEffect(() => {
    handleFetchUserID();
  }, []);

  return (
    <Container>
      <Navbar />
      <StyledForm
        success={formBehavior.success}
        error={formBehavior.error}
        onSubmit={handleSubmit(handleSubmitForm)}
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
              {errors.nome && (
                <Label pointing color="red">
                  O nome precisa ter mais de 10 dígitos!
                </Label>
              )}
            </FormField>

            <FormField>
              <label htmlFor="cpf">CPF</label>
              <InputForm
                name="cpf"
                placeholder="xxx.xxx.xxx-xx"
                onChange={handleUpdateCPF}
                maxLength={14}
                ref={register({ required: true })}
              />
              {errors.cpf && (
                <Label pointing color="red">
                  Informe um cpf válido!
                </Label>
              )}
            </FormField>

            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="email">E-mail</label>
                <InputForm
                  name="email"
                  defaultValue=""
                  placeholder="example@gmail.com"
                  ref={register({
                    required: true,
                    pattern: validateEmailRegex,
                  })}
                />
                {errors.email && (
                  <Label pointing color="red">
                    Informe um e-mail válido!
                  </Label>
                )}
              </FormField>

              <FormField>
                <label htmlFor="cep">CEP</label>
                <InputForm
                  name="cep"
                  placeholder="xxxxx-xxx"
                  ref={register({ required: true })}
                  maxLength={9}
                  onChange={handleUpdateCep}
                  onBlur={() => handleFetchCEP}
                />
                {errors.nome && (
                  <Label pointing color="red">
                    Informe um cep válido!
                  </Label>
                )}
              </FormField>
            </StyledGroup>
          </Grid.Column>

          <Grid.Column computer={10} tablet={13} mobile={13}>
            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="rua">Rua</label>
                <InputForm
                  name="rua"
                  ref={register({ required: true })}
                  readOnly={isFetched}
                />
              </FormField>

              <FormField>
                <label htmlFor="numero">Número</label>
                <InputForm
                  name="numero"
                  onChange={handleUpdateNumero}
                  ref={register({ required: true })}
                />
                {errors.numero && (
                  <Label pointing color="red">
                    Informe um número!
                  </Label>
                )}
              </FormField>
            </StyledGroup>

            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="bairro">Bairro</label>
                <InputForm
                  name="bairro"
                  ref={register({ required: true })}
                  readOnly={isFetched}
                />
              </FormField>

              <FormField>
                <label htmlFor="cidiade">Cidade</label>
                <InputForm
                  name="cidade"
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
            <StyledFormButton fluid positive type="submit">
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
