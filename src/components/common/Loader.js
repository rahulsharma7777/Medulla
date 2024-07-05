import React from "react";
import { useSelector } from "react-redux";

const Pageloader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  return (
    <>
      {isLoading && (
        <div className="pageloader">
          <span class="loader"></span>
        </div>
      )}
    </>
  );
};
export default Pageloader;
