import React from "react";
import style from "./TextInput.module.scss";

interface TextFieldProps {
  labelName?: string;
  inputName?: string;
  type?: "text" | "password" | "number" | "email" | "date"; // Define specific types;
  value?: string;
  errMsg?: string;
  inputHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder?: string;
  ariaLabel?: string;
  //style?: React.CSSProperties;
  //passwordConfirmref?: React.RefObject<HTMLInputElement>;
}

const TextField: React.FC<TextFieldProps> = ({
  labelName,
  inputName,
  type,
  value,
  //errMsg,
  inputHandler,
  placeHolder,
  ariaLabel,
  //style,
  //passwordConfirmref,
}) => {
  return (
    <div className={style.inputBox}>
      <div className={style.label}>
        <p>{labelName}</p>
      </div>
      <input
        aria-labelledby={ariaLabel}
        className={style.field}
        type={type}
        name={inputName}
        value={value}
        placeholder={placeHolder}
        //ref={passwordConfirmref}
        onChange={inputHandler}
        autoComplete="off"
        required
        //minLength="3"
      />
    </div>
  );
};

export default TextField;
