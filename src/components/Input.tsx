import { FunctionComponent } from "react";
import { FieldValues, UseFormRegister, ValidationRule } from "react-hook-form";

const Input: FunctionComponent<{
  register: UseFormRegister<FieldValues>;
  label: string;
  error: any;
  fieldName: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}> = ({ register, fieldName, label, error, ...rest }) => {
  return (
    <div className="flex flex-col w-full space-y-1">
      <span className="text-lg">{label}</span>
      <input
        type="text"
        {...rest}
        {...register(fieldName)}
        className="p-1 rounded-md bg-dark-400 focus:outline-none"
      />

      <p className="m-0 mt-1 text-red-600">{error?.message}</p>
    </div>
  );
};

export default Input;
