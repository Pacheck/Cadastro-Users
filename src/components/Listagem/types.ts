export interface IUserShape {
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