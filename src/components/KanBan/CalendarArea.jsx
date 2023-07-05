import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import { setCurrentDate } from "redux/actions";
import { useAppCalendar, eventsCalendarRef } from "hooks/Calendar";
import EventHeader from "./EventHeader";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import { useGetCalendarTasks } from "hooks/ProjectTask.jsx";
import { openPortfolio } from "redux/reducers/portfolio";
import AddPortfolioDialog from "components/Main/portfolio/AddPortfolioDialog";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import './CalendarStyling.css'
import { taskDrawyerOpen } from "redux/actions";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";

// import '@fullcalendar/common/main.css'; 
// import '@fullcalendar/daygrid/main.css'; 

const CalendarArea = () => {
  const CurrentDate = useSelector((calendar) =>
    console.log("calendar", calendar)
  );
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );
  const dispatch = useDispatch();

  const handleDates = (rangeInfo) => {
    dispatch(setCurrentDate(rangeInfo));
  };
  const workspaceId = localStorage.getItem("workspaceId");

  const { data: getCalendarData } = useQuery(
    ["get_data_calendar_events"],
    () => {
      return axios.get(`/task/calender/${workspaceId}`);
    },
    {
      select: (res) => {
        return res?.data?.data?.map((val) => {
          return {
            id: val?.id,
            title: val?.name,
            start: val?.startDate,
            end: val?.endDate,
          };
        });
      },
    }
  );


  const GetCalendarData = useGetCalendarTasks({
    workspace_id: workspaceId,
    // onSuccess,
  });
  const calendarData = GetCalendarData?.workspaceResponse?.data?.data?.data;

  const renderEventContent = (eventInfo) => {
    return (
      <Box
        sx={{
          backgroundColor:
            eventInfo?.event?.extendedProps?.color ?? "primary.dark",
        }}
        className={clsx(
          "flex items-center w-full rounded-4 px-8 py-2 h-22 text-white"
        )}
      >
        <Typography className="text-12 font-semibold">
          {eventInfo?.timeText}
        </Typography>
        <Typography className="text-12 px-4 truncate">
          {/* {eventInfo?.} */}
        </Typography>
      </Box>
    );
  };

  const handleEventClick = (eventInfo) => {
    dispatch(taskDrawyerOpen(+eventInfo?.event?.id))
  };

  const handleEventDrop = (eventDropInfo) => {
    const { id, startStr, endStr } = eventDropInfo.event;
    updateDates({
      id,
      eventStartDate: startStr || endStr,
      eventEndDate: endStr || startStr,
    });
  };
  return (
    <div className="p-[20px]">
      {/* <EventHeader /> */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        events={getCalendarData}
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        // eventContent={renderEventContent}
        // select={handleEventClick}
        eventClick={handleEventClick}
        // eventDrop={handleEventDrop}
        // initialDate={new Date()}
        // ref={eventsCalendarRef}
      />
      {/* <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView="dayGridMonth"
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        datesSet={handleDates}
       
        eventContent={renderEventContent}
        select={handleEventClick}
        eventDrop={handleEventDrop}
        initialDate={new Date()}
        ref={eventsCalendarRef}
      /> */}

      <AddPortfolioDialog />
      {isOpenTaskDrawer && <TaskDrwayer />}
    </div>
  );
};

export default CalendarArea;
