import React from "react";

export default function FormValidation({
  validator,
  field,
  value,
  rule,
  outsideError = "",
}) {
  let msg = validator.message(field, value, rule);
  if (outsideError !== "") {
    msg = outsideError;
  }
  return <span className="form-error">{msg}</span>;
}
