import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useDispatch, useSelector } from "react-redux";
// import { useSelector } from "react-redux";
// import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
// import ModuleHeader from "app/shared-components/moduleHeader";
// import { useTranslation } from "react-i18next";
import CalendarViewMenu from "./CalendarViewMenu";
// import useEventsState, { eventsCalendarRef } from "./State.events";

function EventHeader() {
  // const { openDialog } = useEventsState();
  const CurrentDate = useSelector(({calendar}) => calendar);
  console.log(CurrentDate)
  // const mainTheme = useSelector(selectMainTheme);
  const calendarApi = () => eventsCalendarRef.current?.getApi();

  return (
    <div className="w-full">
      {/* <div className="mb-20">
        <ModuleHeader title={t("HEADER_TITLE")} />
      </div> */}
      <div className="flex flex-col md:flex-row w-full justify-between z-10 container">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex items-center">
            <Typography className="text-2xl font-semibold tracking-tight whitespace-nowrap mx-16">
              May 2023
            </Typography>
          </div>

          <div className="flex items-center">
            <Tooltip title="Previous">
              <IconButton
                aria-label="Previous"
                // onClick={() => calendarApi().prev()}
              >
                <KeyboardArrowLeftIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Next">
              <IconButton
                aria-label="Next"
                // onClick={() => calendarApi().next()}
              >
                <KeyboardArrowRightIcon/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Today">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { delay: 0.3 } }}
                >
                  <IconButton
                    aria-label="today"
                    // onClick={() => calendarApi().today()}
                    size="large"
                  >
                    <CalendarTodayIcon/>
                  </IconButton>
                </motion.div>
              </div>
            </Tooltip>
          </div>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <IconButton
            className="mx-8"
            aria-label="add"
            // onClick={() => openDialog()}
          > 
            <AddCircleOutlineIcon/>
          </IconButton>

          <CalendarViewMenu
            currentDate={CurrentDate}
            calendarApi={calendarApi}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default EventHeader;
