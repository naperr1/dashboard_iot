import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

const DateFilter = () => {
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  return (
    <div>
      <Space direction="vertical" size={12}>
        <RangePicker
          onChange={(e) => {
            setStartDate(dayjs(e[0].$d).format("YYYY-MM-DD"));
            setEndDate(dayjs(e[1].$d).format("YYYY-MM-DD"));
          }}
        />
      </Space>
    </div>
  );
};

export default DateFilter;
