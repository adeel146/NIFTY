import * as yup from "yup";

export const workspaceSchema = yup.object({
  name: yup.string().required("Name is Required").default(""),
  url: yup.string().required("Url is Required").default(""),
  // email: yup.string().required("Email is Required"),
  // nameInvite: yup.string(),
});

export const workspaceInviteSchema = yup.object({
  email: yup.string().required("Email is Required"),
  name: yup.string().default(""),
})

export const workspaceInviteCardSchema = yup.object({
  email: yup.string().required("Email is Required").default(""),
  name: yup.string().required("name is Required").default(""),
  password: yup.string().required("Password is Required").default(""),
})
