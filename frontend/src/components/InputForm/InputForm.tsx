import styles from "./InputForm.module.scss";

interface InputFormProps {
  type: string;
  value?: string | Date;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

const InputForm = ({
  type,
  value,
  label,
  onChange,
  placeholder,
  required = false,
}: InputFormProps) => {
  return (
    <div className={styles.InputForm}>
      <div className={styles.label}>{label}</div>
      <input
        type={type}
        value={value instanceof Date ? value.toISOString().split('T')[0] : value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default InputForm;
