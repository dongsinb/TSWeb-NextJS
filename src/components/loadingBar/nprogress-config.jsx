import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./nprogress-custom.css";

// Cấu hình NProgress
NProgress.configure({
  showSpinner: false, 
  easing: "ease", 
  minimum: 0.5, 
  speed: 500, 
  trickleSpeed: 100,
});

export default NProgress;
