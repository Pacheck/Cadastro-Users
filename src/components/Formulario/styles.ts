import styled from 'styled-components';
import { Button, Form, FormGroup, Grid } from "semantic-ui-react";


export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: lightgray;
`;

export const StyledForm = styled(Form)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke',
    marginTop: 30,
    paddingTop: 60,
    paddingBottom: 60,
    borderRadius: 5,
    boxShadow: '0 0 10px #82817f;',
});

export const StyledGroup = styled(FormGroup)({
})

export const StyledFormButton = styled(Button)({
    height: 50,
});

export const FormField = styled(Form.Field)({
});

export const StyledGrid = styled(Grid)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

export const InputForm = styled.input`
`