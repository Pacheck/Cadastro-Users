import axios from "axios";
import { toast } from "react-toastify";
import { createToastNotify } from "./createToast";

export const fetchCEP = async (newCep: string, currentCep: string) => {
    if (newCep !== currentCep) {
      try {
        const res = await axios.get(
          `https://viacep.com.br/ws/${newCep}/json/`
        );
        const { logradouro, localidade, complemento, bairro } = res.data;
        const isFetched = true;
        console.log(res.data);
        createToastNotify("Dados carregados!", toast.info);
        return { newCep, isFetched, logradouro, localidade, complemento, bairro }
        } catch (e) {
            createToastNotify("CEP inválido!", toast.error);
            const isFetched = false;
            const endereco = {
                logradouro: '', localidade: '', complemento: '', bairro: ''
            }
            return { newCep, isFetched, ...endereco  }
      
      }
    }
  };