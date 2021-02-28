import { HtmlImageProps } from "semantic-ui-react/dist/commonjs/generic";
export interface UserShape {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    endereco: {
        cep: string;
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
    }
}

interface ShapedUsers {
    title: string;
    description: string;
    image: HtmlImageProps;
    price: string;
  }