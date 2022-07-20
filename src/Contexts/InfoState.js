import InfoContext from "./InfoContext";
import { useState } from "react";
const InfoState = (props) => {
  const [Progress, setProgress] = useState(0);
  const Loading = (val) => {
    setProgress(val);
  };
  return (
    <InfoContext.Provider
      value={{
        Progress,
        Loading,
      }}
    >
      {props.children}
    </InfoContext.Provider>
  );
};
export default InfoState;
