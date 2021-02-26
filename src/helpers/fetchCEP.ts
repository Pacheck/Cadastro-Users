import axios from "axios";
import { toast } from "react-toastify";
import { createToastNotify } from "./createToast";

export const fetchCEP = async (newCep: string, currentCep: string) => {
    if (newCep !== currentCep && newCep !== "") {
      try {
        const res = await axios.get(
          `https://viacep.com.br/ws/${newCep}/json/`
        );
        const { logradouro, localidade, bairro } = res.data;
        console.log(res.data);
        const isFetched = true;
        if(res.data.erro){
          createToastNotify("Digite um CEP válido!", toast.error)
          return {}
        }
        createToastNotify("Dados carregados!", toast.info);
        return { newCep, isFetched, logradouro, localidade, bairro }

          
      } catch (e) {
          createToastNotify("CEP inválido!", toast.error);
          const isFetched = false;
          const endereco = {
              logradouro: '', localidade: '', bairro: ''
          }
          return { newCep, isFetched, ...endereco  }  
      }
    }
    throw new Error('Houve um erro com o CEP')
  };