import React from "react";
import { PropagateLoader } from "react-spinners";

const Loader = ({ loading, color='black' }) => {
  return (
    <div style={{ display: "grid", placeItems: "center", margin: "5rem auto" }}>
      <PropagateLoader
        loading={loading}
        size={10}
        color={color}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
