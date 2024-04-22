import React from "react";
import Header from "../Header/Header";
import "./Profile.css";
import avatar from "../image/avatar.jpg";

const Profile = () => {
  return (
    <div className="container" style={{ height: "calc(100vh - 75px)" }}>
      {/* <Header data={"Profile"} /> */}

      <div className="profile" style={{ marginTop: "20px" }}>
        <div>
          <h2>Thông tin sinh viên</h2>
          <table>
            <tbody>
              <tr>
                <td>Mã sinh viên:</td>
                <td>B20DCPT151</td>
              </tr>
              <tr>
                <td>Họ và tên:</td>
                <td>Nguyễn An Phát</td>
              </tr>
              <tr>
                <td>Lớp:</td>
                <td>D20PTDPT</td>
              </tr>
            </tbody>
          </table>
        </div>
        <img src={avatar} alt="" />
      </div>
    </div>
  );
};

export default Profile;
