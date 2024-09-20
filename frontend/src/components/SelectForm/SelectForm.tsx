import styles from './SelectForm.module.scss';

interface SelectFormProps {
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: string[];
  required?: boolean;
}

const SelectForm = ({
  value,
  label,
  onChange,
  placeholder,
  options,
  required = false,
}: SelectFormProps) => {
  return (
    <div className={styles.SelectForm}>
      <label htmlFor={label}>{label}</label>
      <select id={label} value={value} onChange={onChange} required={required}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForm;
