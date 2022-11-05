import React from "react";

function Output(props) {
  return (
    <div className="outputScreen" id="display">
      {props.currentValue}
    </div>
  );
}
export default Output;
