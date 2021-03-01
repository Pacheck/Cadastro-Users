import { Button, Form, FormField, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

export const Container = styled.div`
    background-color: #f7f7f7;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const StyledForm = styled(Form)({
    minWidth: '80%',
    backgroundColor: "#fff",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid lightgrey',
    borderRadius: 5,
    boxShadow: '0 0 5px darkgrey'
});

export const StyledGrid = styled(Grid)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 500,
});
export const StyledGridColumn = styled(Grid.Column)({
    display: 'flex',
    alignSelf: 'center'
});
export const StyledFormField = styled(FormField)({});
export const StyledButton = styled(Button)({});
