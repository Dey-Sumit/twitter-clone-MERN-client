import classNames from "classnames";
import { FunctionComponent } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

const Input: FunctionComponent<{
  register: UseFormRegister<FieldValues>;
  label?: string;
  error?: any;
  fieldName: string;
  type?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  isTypedTextarea?: boolean;
}> = ({ register, fieldName, label, error, type, isTypedTextarea, ...rest }) => {
  return (
    <div className={classNames("flex flex-col w-full space-y-1", { hidden: type === "file" })}>
      <span className="text-lg">{label}</span>
      {!isTypedTextarea ? (
        <input
          type={type}
          {...rest}
          {...register(fieldName)}
          className="p-1 px-4 rounded-md bg-dark-400 focus:outline-none"
        />
      ) : (
        <textarea
          {...rest}
          {...register(fieldName)}
          className="p-1 px-4 rounded-md bg-dark-400 focus:outline-none h-20"
        />
      )}

      <p className="m-0 mt-1 text-red-600">{error?.message}</p>
    </div>
  );
};

export default Input;
