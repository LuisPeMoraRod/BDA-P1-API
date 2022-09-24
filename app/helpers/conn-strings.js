require('dotenv').config(); // read .env file

exports.setDBUrl = () => {
    const instance = process.env.INSTANCE;
    switch (instance) {
        case "0":
            return process.env.MONGODB0;
        case "1":
            return process.env.MONGODB1;
        case "2":
            return process.env.MONGODB2;
        default:
            break;
    }
}

exports.setPort = () => {
    const instance = process.env.INSTANCE;
    switch (instance) {
        case "0":
            return process.env.PORT0;
        case "1":
            return process.env.PORT1;
        case "2":
            return process.env.PORT2;
        default:
            return 3000;
    }
}

exports.setReplicaAPIs = () => {
    const instance = process.env.INSTANCE;
    const api0 = process.env.API0;
    const api1 = process.env.API1;
    const api2 = process.env.API2;

    switch (instance) {
        case "0":
            return [api1, api2];
        case "1":
            return [api0, api2];
        case "2":
            return [api0, api1];
        default:
            break;
    }
}