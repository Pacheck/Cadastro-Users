import { InputForm, FormField } from "../Formulario/styles";

export const FieldForm = (props: any) => {
  return (
    <FormField>
      <label htmlFor={props.name}>{props.labelName}</label>
      <InputForm {...props} />
    </FormField>
  );
};
