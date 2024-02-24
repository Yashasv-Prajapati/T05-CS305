"use client";
import { Navbar } from "../../../components/index";
import Lottie from "lottie-react";
import animationData from "../../../public/Animation - 1707626346860.json";

function Signup() {
  return (
    <div className="bg-[#1b222f] overflow-hidden">
      <Navbar />
      <div className="flex justify-between">
        <div className="flex flex-col justify-center border-2 border-transparent p-6 w-1/2">
          <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-white md:text-3xl lg:text-4xl">
            Let&apos;s build something new.
          </h1>
          <div className="mb-16 text-lg font-normal text-gray-500 lg:text-xl xl:px-48 dark:text-gray-400 ">
            To get the insights, import an existing Git Repository.
          </div>
          <button
            type="button"
            className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-2xl text-sm px-5 py-2.5 justify-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2 text-center "
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with Github
          </button>
        </div>
        <div>
          <img
            src="/cover.png"
            alt="hero_cover"
            className="w-full sm:h-[500px] h-[350px] object-cover rounded-tl-[140px] z-10 relative"
          />
          <a href="#explore">
            <div className=" w-full flex justify-end sm:-mt-[70px] -mt-[50px]  relative z-10 ">
              <span className="pr-11 ">
                <span className="w-min flex justify-end sm:-mt-[70px] -mt-[50px]  relative z-10  rounded-full bg-gradient-to-r to-[#2a0670] from-[#250b47]">
                  {/* <img
              src="/stamp.png"
              alt="stamp"
              className="sm:w-[155px] w-[100px] sm:h-[155px] h-[100px] object-contain"
            /> */}
                  <Lottie
                    animationData={animationData}
                    className="sm:w-[155px] w-[100px] sm:h-[155px] h-[100px] object-contain"
                  />
                </span>
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
