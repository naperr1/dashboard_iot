# IOT Dashboard

Project được thực hiện với các nền tảng NodeJS, Reacjs, MySql, MQTT Broker.

## Cài đặt

Đầu tiên clone project về máy bằng câu lệnh trong terminal: 

```bash
git clone https://github.com/naperr1/dashboard_iot.git
```
1. Vào thư mục server tiến hành cài đặt và chạy server

```bash
cd server
npm install
npm start
```

2. Vào thư mục dashboard tiến hành cài đặt và chạy dashboard 

```bash
cd dashboard
npm install
npm start
```

3. Vào file mqtt.js trong thư mục server để thay đổi các thông số tương ứng
```bash
const mqttBroker = "mqtt://*********";
const mqttOptions = {
  username: "*****",
  password: "*****",
};
const dbConfig = {
  host: "*****",
  user: "*****",
  password: "******",
  database: "******",
};
```
