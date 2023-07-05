import * as yup from "yup";

export const workspaceSetupSchema = yup.object({
    name: yup.string().required("Name is Required").default(""),
    url: yup.string().required("Url is Required"),
    customDomain: yup.boolean().default(false),
    workspacesChat: yup.boolean().default(true),
    guestChat: yup.boolean().default(true),
    disableWeekends: yup.boolean().default(true),
    defaultTimeTracker: yup.string().required("Time Tracker Required").default(""),
});

export const checkboxesSchema = yup.object({
    owner: yup.boolean().default(false),
    admin: yup.boolean().default(false),
    member: yup.boolean().default(false),
    guest: yup.boolean().default(false),
})
