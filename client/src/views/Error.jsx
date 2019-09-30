import React from "react";

const Error = props => {
  return (
    <div>
      <h1>Error {props.match.params.code}</h1>
    </div>
  );
};

export default Error;
