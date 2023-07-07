import * as yup from "yup";

export const portfolioSchema = yup.object({
  name: yup.string().required("Name is Required"),
});
export const financeSchema = yup.object({
  date: yup.date().required("Date is Required").typeError("Date is Required"),
  amount: yup.string().required("Amount is Required"),
});
export const milestoneSchema = yup.object({
  name: yup.string().required("Name is Required"),
  description: yup.string().required("Description is Required"),
  color: yup.string().default("#b22e2e").required("Color is Required"),
  manager_Id: yup.object().required("Sponsor is Required"),
});
export const meetingsSchema = yup.object({
  name: yup.string().required("Name is Required"),
});

export const addProjectSchema = yup.object({
  name: yup.string().required("Name is Required"),
  startDate: yup.string().required("Start Date is Required"),
  endDate: yup.string().required("End Date is Required"),
  type_value: yup
    .string()
    .required("Policy is Required")
    .typeError("Policy is Required"),
});

export const fileSchema = yup.object({
  name: yup.string().required("Name is Required").default(""),
});

export const uploadFileSchema = yup.object({
  attachment: yup
    .object()
    .shape({
      file_name: yup.string().nullable(),
      file_path: yup.string().nullable(),
      file_content: yup.string().nullable(),
      file_extension: yup.string().nullable(),
      file_identifier: yup.string().nullable(),
    })
    .default({})
    .nullable(),
});
