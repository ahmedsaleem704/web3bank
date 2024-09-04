function Input({
    handleChange,
    value,
    id,
    name,
    type,
    isRequired = false,
    placeholder,
    customClass,
    hideLabel = true,
    labelText,
    labelFor,
}) {
    return (
        <div>
            {!hideLabel && <label htmlFor={labelFor}>
                {labelText}
            </label>}
            <input
                onChange={handleChange}
                value={value}
                id={id}
                name={name}
                type={type}
                required={isRequired}
                className={customClass ? customClass : 'w-80 h-11 bg-[#224957] rounded-lg px-3 text-white'}
                placeholder={placeholder}
            />
        </div>
    )
}

export default Input;
