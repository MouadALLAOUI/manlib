// import toast from "react-hot-toast";

function logger(message, type = "log") {
  // console.log("All Env Vars:", process.env);
  // console.log("condition", process.env.REACT_APP_ENV === "Development")
  if (process.env.REACT_APP_ENV === "Development") {
    switch (type) {
      case "log":
        console.log(message);
        break;
      case "error":
        console.error(message);
        break;
      case "info":
        console.info(message);
        break;
      default:
        console.log(message);
        break;
    }
  }
}

export default logger;