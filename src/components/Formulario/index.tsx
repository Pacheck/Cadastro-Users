import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

import { validateCPF } from "./helpers/validateCPF";
import { createToastNotify } from "../Login/helpers/createToast";
import { validateEmail } from "../Login/helpers/validateEmail";
import { validateCEP } from "./helpers/validateCEP";
import { IEndereco, IFormValues } from "./types";
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

const enderecoInitialState: IEndereco = {
  logradouro: "",
  localidade: "",
  complemento: "",
  bairro: "",
};

const Formulario = () => {
  const [maskedCPF, setMaskedCPF] = useState("");
  const [maskedCEP, setMaskedCEP] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [currentFetchedCep, setCurrentFetchedCep] = useState("");
  const [endereco, setEndereco] = useState(enderecoInitialState);
  const [formBehavior, setFormBehavior] = useState({
    success: false,
    error: false,
  });
  const { register, handleSubmit, errors } = useForm<IFormValues>();

  const handleValidateUserData = (data: IFormValues) => {
    try {
      console.log(data);
      // console.log(validateCPF(data.cpf));
      // console.log(data.email);
      // console.log(validateEmail(data.email));
      setFormBehavior({ error: false, success: true });
    } catch (e) {
      createToastNotify("Houve um erro com seus dados!", toast.warn);
      setFormBehavior({ error: true, success: false });
    }
  };

  const handleUpdateCPF = (e: any) => {
    setMaskedCPF(validateCPF(e.target.value));
  };

  const handleUpdateCep = (e: any) => {
    setMaskedCEP(validateCEP(e.target.value));
  };

  const handleFetchCep = async () => {
    if (maskedCEP !== currentFetchedCep) {
      try {
        const res = await axios.get(
          `https://viacep.com.br/ws/${maskedCEP}/json/`
        );
        console.log(res.data);
        const { logradouro, localidade, complemento, bairro } = res.data;
        setEndereco({ logradouro, localidade, complemento, bairro });
        createToastNotify("Dados carregados!", toast.info);
        setIsFetched(true);
      } catch (e) {
        createToastNotify("CEP inválido!", toast.error);
        setEndereco(enderecoInitialState);
      }
    }
    setCurrentFetchedCep(maskedCEP);
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
          <Grid.Column computer={10} tablet={16} mobile={16}>
            {/* <FieldForm
              name="nome"
              labelName="Nome"
              defaultValue=""
              ref={register({
                required: true,
                minLength: 10,
                maxLength: 100,
              })}
            /> TESTANDO ESSE COMPONENTE ABSTRAIDO PRA EVITAR USAR O MESMO CÓDIGO VÁRIAS VEZES */}

            <FormField>
              <label htmlFor="nome">Nome</label>
              <InputForm
                name="nome"
                // autoFocus
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
                value={maskedCPF}
                placeholder="xxx.xxx.xxx-xx"
                onChange={handleUpdateCPF}
                ref={register({ required: true, minLength: 11, maxLength: 14 })}
              />
            </FormField>

            <StyledGroup widths={2}>
              <FormField>
                <label htmlFor="email">E-Mail</label>
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
                  value={maskedCEP}
                  placeholder="xxxxx-xxx"
                  ref={register({ required: true, minLength: 8 })}
                  maxLength={9}
                  onChange={handleUpdateCep}
                  onBlur={handleFetchCep}
                />
              </FormField>
            </StyledGroup>
          </Grid.Column>

          <Grid.Column computer={10} tablet={16} mobile={16}>
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
                <label htmlFor="cidade">Cidade</label>
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
              primary
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
