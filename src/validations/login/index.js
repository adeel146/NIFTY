import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().email().required("Email Required").default(""),
  password: yup.string().required("Password Required").default(""),
});

export const signupScheme = yup.object({
  email: yup.string().email().required("Email Required").default(""),
});
