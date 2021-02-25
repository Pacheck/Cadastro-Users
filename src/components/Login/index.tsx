import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Container, LoginCard, LoginForm } from "./styles";
import { validateEmail } from "../../helpers/validateEmail";
import { validatePassword } from "../../helpers/validatePassword";
import { createToastNotify } from "../../helpers/createToast";
import { FormValues } from "./types";

const Login = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormValues>();

  const validateForm = (data: FormValues) => {
    const { email, password } = data;

    try {
      if (validateEmail(email) && validatePassword(password)) {
        localStorage.setItem("token", uuidv4());

        console.log("data was stored successfully");
        console.log(localStorage.getItem("token"));

        createToastNotify("Logado com sucesso", toast.success);

        history.push("/listagem");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFormErrors = () => {
    if (errors.email) {
      createToastNotify("Digite um e-mail válido.", toast.error);
    }

    if (errors.password) {
      createToastNotify("Digite uma senha válida.", toast.error);
    }
  };

  return (
    <Container>
      <LoginCard>
        <LoginForm onSubmit={handleSubmit(validateForm)}>
          <label htmlFor="email">E-mail</label>
          <input
            name="email"
            autoFocus
            defaultValue=""
            placeholder="example@gmail.com"
            ref={register({ required: true })}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            defaultValue=""
            ref={register({ required: true })}
          />

          <input type="submit" onClick={handleFormErrors} />
        </LoginForm>
      </LoginCard>
    </Container>
  );
};

export default Login;
