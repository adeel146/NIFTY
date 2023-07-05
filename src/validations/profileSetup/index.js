import * as yup from "yup";

export const profileSetupSchema = yup.object({
  username: yup.string().required("Username Required").default(""),
  password: yup.string().required("Password Required").default(""),
});
export const profileSetup = yup.object({
  password: yup.string().required("Password Required").default(""),
  old_password: yup.string().required("Old Password Required").default(""),
});

export const notificationSchema = yup.object({
  browser: yup.boolean().default(null),
  mobile: yup.boolean().default(null),
  email: yup.boolean().default(null),
})


