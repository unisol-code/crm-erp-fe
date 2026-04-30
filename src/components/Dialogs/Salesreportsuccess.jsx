import React from "react";
import { TiTick } from "react-icons/ti";
import backimg from "../../assets/images/back.png";

const Salesreportsuccess = ({ setreportsuccess, setmodal }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center z-[100] items-center">
        <button
          onClick={() => {
            setreportsuccess(false);
            setmodal(false);
          }}
          className="text-white text-xl absolute top-[94px] right-[510px]"
        >
          x
        </button>
        <div className="w-[510px] h-[370px] bg-white rounded-lg mb-32 flex flex-col">
          {/* Header Section */}
          <div className="relative w-full h-[80px]">
            <img src={backimg} alt="" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-5 transform -translate-y-1/2 text-black text-2xl font-bold">
              Sales Report
            </p>
          </div>

          {/* Body Content */}
          <div className="text-center py-16 text-2xl">
            <p>New Sales Report Added Successfully!</p>
          </div>
          <div className="ps-56 absolute bottom-96">
            <TiTick size={50} color="blue" />
          </div>
          <div className="text-center ">
            <p>
              The new Sales Report has been added successfully to the database.
            </p>
          </div>

          {/* Cancel Button */}
          <div className="ps-4 ms-52 rounded-lg my-5 py-2.5 text-white w-[80px] bg-gray-300">
            <button disabled>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salesreportsuccess;
