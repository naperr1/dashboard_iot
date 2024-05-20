// import React, { useState, useCallback } from "react";
// import { FaRegLightbulb } from "react-icons/fa";
// import fan from "../image/fan.png";
// import "./Device.css";
// import axios from "axios";

// const Device = () => {
//   const [isToggled, setToggled] = useState(false);
//   const [isLightToggled, setLightToggled] = useState(false);

//   const handleToggle = () => {
//     const newToggledState = !isToggled;
//     setToggled(newToggledState);
//     sendToggleRequest("Fan", newToggledState ? "on" : "off");
//   };

//   const handleLightToggle = () => {
//     const newLightToggledState = !isLightToggled;
//     setLightToggled(newLightToggledState);
//     sendToggleRequest("Light", newLightToggledState ? "on" : "off");
//   };

//   const sendToggleRequest = useCallback((device, status) => {
//     axios
//       .post("http://localhost:5000/get-action-history/toggle-device", {
//         status,
//         device,
//       })
//       .then((response) => {
//         console.log("Toggle request sent successfully:", response.data);
//       })
//       .catch((error) => {
//         console.error("Error sending toggle request:", error);
//       });
//   }, []);

//   return (
//     <div className="turn">
//       <div className="turn_fan">
//         <img
//           src={fan}
//           className={`fan-icon ${isToggled ? "rotate" : ""}`}
//           alt=""
//         />
//         <div
//           className={`toggle-switch ${isToggled ? "active" : ""}`}
//           onClick={handleToggle}
//         >
//           <div className="slider"></div>
//         </div>
//       </div>

//       <div className="turn_light">
//         <FaRegLightbulb
//           className={isLightToggled ? "light-on" : ""}
//           style={{ fontSize: "50px", marginBottom: "20px" }}
//         />
//         <div
//           className={`toggle-switch ${isLightToggled ? "active" : ""}`}
//           onClick={handleLightToggle}
//         >
//           <div className="slider"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Device;

import React, { useState, useEffect, useCallback } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import fan from "../image/fan.png";
import "./Device.css";
import axios from "axios";

const Device = () => {
  const [isToggled, setToggled] = useState(false);
  const [isLightToggled, setLightToggled] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const fetchInitialStatus = useCallback(() => {
    axios
      .get("http://localhost:5000/get-action-history/api/device_status")
      .then((response) => {
        const { Fan, Light } = response.data;
        setToggled(Fan === "on");
        setLightToggled(Light === "on");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching initial status:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchInitialStatus();
  }, [fetchInitialStatus]);

  const handleToggle = () => {
    const newToggledState = !isToggled;
    setToggled(newToggledState);
    sendToggleRequest("Fan", newToggledState ? "on" : "off");
  };

  const handleLightToggle = () => {
    const newLightToggledState = !isLightToggled;
    setLightToggled(newLightToggledState);
    sendToggleRequest("Light", newLightToggledState ? "on" : "off");
  };

  const sendToggleRequest = useCallback((device, status) => {
    axios
      .post("http://localhost:5000/get-action-history/toggle-device", {
        status,
        device,
      })
      .then((response) => {
        console.log("Toggle request sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending toggle request:", error);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="turn">
      <div className="turn_fan">
        <img
          src={fan}
          className={`fan-icon ${isToggled ? "rotate" : ""}`}
          alt=""
        />
        <div
          className={`toggle-switch ${isToggled ? "active" : ""}`}
          onClick={handleToggle}
        >
          <div className="slider"></div>
        </div>
      </div>

      <div className="turn_light">
        <FaRegLightbulb
          className={isLightToggled ? "light-on" : ""}
          style={{ fontSize: "50px", marginBottom: "20px" }}
        />
        <div
          className={`toggle-switch ${isLightToggled ? "active" : ""}`}
          onClick={handleLightToggle}
        >
          <div className="slider"></div>
        </div>
      </div>
    </div>
  );
};

export default Device;
