import toast from "react-hot-toast";

function logger(message) {
  if (process.env.APP_ENV === "Development") {
    console.log(message);
  }
}

export default logger;