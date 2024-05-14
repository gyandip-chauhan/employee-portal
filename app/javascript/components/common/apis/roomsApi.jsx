import axios from "../apiService";

const path = "/rooms";

const get = async () => axios.get(path);
const create = async payload => axios.post(`${path}`, payload);
const show = async (id) => axios.get(`${path}/${id}`);

const roomsApi = { get, create, show };

export default roomsApi;
