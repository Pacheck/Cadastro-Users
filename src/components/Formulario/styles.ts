import styled from 'styled-components';
import { Button, Form, FormGroup, Grid } from "semantic-ui-react";


export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StyledForm = styled(Form)({
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '50px',
   
})

export const StyledGroup = styled(FormGroup)({
})

export const StyledFormButton = styled(Button)({

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