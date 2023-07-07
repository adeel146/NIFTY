import * as yup from "yup";

export const projectTaskSchema = yup.object({
  name: yup.string().required("Name is Required").default(""),
  project_Id: yup.number().required("Project Id is requires").default(0),
  description: yup.string().required("Description is Required").default(""),
  status_Id: yup.number().required("Status Id is requires").default(0),
  dueDate: yup.date().required("Due DATE REQUIRED").typeError("Due DATE REQUIRED").nullable().default(null),
  // addOnTop: yup.boolean().default(true),
  // assignees: yup.array()
  // // .of(
  // //   object({
  // //   })
  // // )
  // // .required("Attachments Required")
  // // .min(1, "Attachments Required")
  // .default([]),
});

export const duplicateProjectSchema = yup.object({
  name: yup.string().required("Name is Required").default(""),
})
