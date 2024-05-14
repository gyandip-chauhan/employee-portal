import axios from "../apiService";

const path = "/users";

const get = async () => axios.get(path);
const show = async (id) => axios.get(`${path}/${id}`);

const usersApi = { get, show };

export default usersApi;
