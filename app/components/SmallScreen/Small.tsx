import Image from "next/image";
import Logo from "../header/logo.svg";
const SmallScreen = () => {
  return (
    <div className="smallContainer">
      <div className="smallContent">
        <div className="smallLog">
          <Image src={Logo} alt="logo" />
        </div>
        <h1>INACCESSIBLE</h1>
        <p>Please switch to a larger device to access the app.</p>
      </div>
    </div>
  );
};

export default SmallScreen;
