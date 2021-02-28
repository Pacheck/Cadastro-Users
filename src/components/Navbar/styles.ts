import { Button, ButtonContent, Icon, Menu, MenuItem, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

export const Container = styled.div`
    width: 100vw;
    height: 75px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #444;
    color: #ddd;
    top: 0;
`;
export const Title = styled.h1`
`

export const StyledButton = styled(Button)({});
export const StyledButtonContent = styled(ButtonContent)({});
export const StyledIcon = styled(Icon)({});
export const StyledMenu = styled(Menu)({});
export const StyledMenuItem = styled(MenuItem)({
    ":hover": {
        color: 'black',
        backgroundColor: 'red'
    }
});
export const StyledSegment = styled(Segment)({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});