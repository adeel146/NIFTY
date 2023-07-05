export const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export const getCurrTime = (currentTime) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Format hours
  let formattedHours = hours % 12;
  formattedHours = formattedHours ? formattedHours : 12; // Handle 0 as 12
  formattedHours = formattedHours < 10 ? "0" + formattedHours : formattedHours;

  // Format minutes
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  // Determine AM or PM
  const amPm = hours >= 12 ? "PM" : "AM";

  // Combine all parts
  const formattedTime = `${formattedHours}:${formattedMinutes}${amPm}`;
  return formattedTime;
};

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formateDate = (date) => {
  const currentDate = new Date(date);
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
  return formattedDate;
};
