import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
}

export default function FormInput({ label, id, type, placeholder, register, error, className }: FormInputProps) {
  return (
    <div className="space-y-1">
      {/* <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label> */}
      <input
        id={id}
        type={type}
        {...register}
        className={"w-full p-2 border rounded border-2 focus:border-white focus:border-2 focus:outline-0" }
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}