import axios from "axios";

const axiosinstance = axios.create({
    baseURL: 'http://localhost:5501',

    timeout: 9000,
    headers: {
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Header":
            "Origin, Content-Type, X-Requested-With, Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS,PUT,DELETE",
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default axiosinstance;