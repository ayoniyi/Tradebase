import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
//import SelectInput from '@mui/material/Select/SelectInput';

const SelectField = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.4786 10.9978C7.07996 11.1983 7.55184 11.6702 7.75229 12.2715C7.95629 12.8835 8.82197 12.8835 9.02597 12.2715C9.22642 11.6702 9.6983 11.1983 10.2997 10.9978C10.9117 10.7938 10.9117 9.92816 10.2997 9.72416C9.6983 9.52371 9.22642 9.05183 9.02597 8.45048C8.82197 7.83846 7.95629 7.83846 7.75229 8.45048C7.55184 9.05183 7.07996 9.52371 6.4786 9.72416C5.86659 9.92816 5.86659 10.7938 6.4786 10.9978Z"
              fill="#DD524D"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.25 2.5C3.48858 2.5 1.25 4.73858 1.25 7.5V22.5C1.25 25.2614 3.48858 27.5 6.25 27.5H23.75C26.5114 27.5 28.75 25.2614 28.75 22.5V7.5C28.75 4.73858 26.5114 2.5 23.75 2.5H6.25ZM26.25 17.2477V7.5C26.25 6.11929 25.1307 5 23.75 5H6.25C4.86929 5 3.75 6.11929 3.75 7.5V22.5C3.75 23.8807 4.86929 25 6.25 25H6.42834C6.31258 24.6454 6.25 24.2668 6.25 23.8736C6.25 23.13 6.47859 22.4044 6.90479 21.7951L10.4194 16.7704C11.5271 15.1867 13.657 14.7042 15.339 15.656L15.7337 15.8793L16.3245 15.0352C17.4932 13.3657 19.7812 12.9351 21.4768 14.0655L26.25 17.2477ZM14.2934 17.9368L14.1079 17.8318C13.5472 17.5146 12.8372 17.6754 12.468 18.2033L8.95338 23.228C8.821 23.4173 8.75 23.6427 8.75 23.8736C8.75 24.4957 9.2543 25 9.87638 25H11.2652C10.8823 23.9275 10.9758 22.6763 11.7295 21.5995L14.2934 17.9368ZM14.8016 25H23.75C25.1307 25 26.25 23.8807 26.25 22.5V20.9213C26.25 20.5034 26.0411 20.1131 25.6934 19.8812L20.09 16.1457C19.5248 15.7689 18.7621 15.9124 18.3726 16.4689L13.7776 23.0332C13.1977 23.8616 13.7904 25 14.8016 25Z"
              fill="#DD524D"
            />
          </svg>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default SelectField;
