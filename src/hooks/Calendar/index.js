import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "../../static/apis";
import { createRef } from "react";

export const eventsCalendarRef = createRef(null);

export const useAppCalendar = (param) => {
  return useAppQuery('vslrnfrt',Apis.calendar, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};
