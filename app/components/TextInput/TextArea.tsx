import React from "react";
import style from "./TextInput.module.scss";

interface TextAreaProps {
  labelName?: string;
  inputName?: string;
  //type?: "text" | "password" | "number" | "email"; // Define specific types
  value?: string;
  errMsg?: string;
  inputHandler?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; // Use HTMLTextAreaElement for textarea
  placeHolder?: string;
  ariaLabel?: string;
  // passwordConfirmref?: React.RefObject<HTMLInputElement>;
}

const TextArea: React.FC<TextAreaProps> = ({
  labelName,
  inputName,
  //type = "text", // Set default type
  value,
  // errMsg,
  inputHandler,
  placeHolder = "",
  ariaLabel = "",
  // passwordConfirmref,
}) => {
  return (
    <div className={style.inputBox}>
      <div className={style.label}>
        <p>{labelName}</p>
      </div>
      <textarea
        aria-label={ariaLabel} // Correct prop name
        className={style.fieldBig}
        //type={type}
        name={inputName}
        value={value}
        placeholder={placeHolder}
        // ref={passwordConfirmref}
        onChange={inputHandler}
        autoComplete="off"
        required
        // minLength="3"
      ></textarea>
    </div>
  );
};

export default TextArea;
