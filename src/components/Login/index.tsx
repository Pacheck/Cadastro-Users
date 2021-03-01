import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validateEmail, validateEmailRegex } from "../../helpers/validateEmail";
import { validatePassword } from "../../helpers/validatePassword";
import { createToastNotify } from "../../helpers/createToast";
import { FormValues } from "./types";
import { Icon, Input, Label } from "semantic-ui-react";

import {
  Container,
  StyledButton,
  StyledForm,
  StyledGrid,
  StyledGridColumn,
} from "./styles";

const Login = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormValues>();

  const handleLoginSubmit = (data: FormValues) => {
    const { email, password } = data;

    try {
      if (validateEmail(email) && validatePassword(password)) {
        localStorage.setItem("token", uuidv4());
        createToastNotify("Logado com sucesso", toast.success);
        history.push("/listagem");
      }
    } catch (e) {}
  };

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(handleLoginSubmit)}>
        <StyledGrid>
          <StyledGridColumn computer={5} tablet={8} mobile={14}>
            <StyledForm.Field>
              <label htmlFor="email">E-mail</label>
              <Input iconPosition="left" placeholder="E-mail" name="email">
                <Icon name="at" />
                <input
                  ref={register({
                    required: true,
                    pattern: validateEmailRegex,
                  })}
                />
              </Input>
              {errors.email && (
                <Label basic color="red" pointing="above">
                  Informe um e-mail válido!
                </Label>
              )}
            </StyledForm.Field>

            <StyledForm.Field>
              <label htmlFor="password">Senha</label>
              <Input iconPosition="left" placeholder="******" name="password">
                <Icon name="key" />
                <input
                  ref={register({ required: true, minLength: 4 })}
                  type="password"
                />
              </Input>
              {errors.password && (
                <Label basic color="red" pointing="above">
                  Insira uma senha com mais de quatro dígitos!
                </Label>
              )}
            </StyledForm.Field>

            <StyledButton primary type="submit">
              Login
            </StyledButton>
          </StyledGridColumn>
        </StyledGrid>
      </StyledForm>
    </Container>
  );
};

export default Login;
