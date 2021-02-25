export interface IUserShape {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    cep: string;
    endereco: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
    }
}