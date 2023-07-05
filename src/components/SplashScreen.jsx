import NiftyLogo from "/images/logo-three60.png";
import Loader from "../assets/Loader";

const SplashScreen = () => {
  return (
    <div className="loader-wrapper h-screen w-full">
      <div className="max-w-[925px] m-auto flex h-full justify-center items-center flex-col">
        <div className="text-center w-full flex justify-center mt-5">
          <a href="#">
            <img src={NiftyLogo} alt="" className="w-28" />
          </a>
        </div>
        <div className="w-[120px] h-[120px] mt-10">
          <Loader />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
