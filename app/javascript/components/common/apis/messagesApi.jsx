import axios from "../apiService";

const path = "/messages";

const create = async (payload) => axios.post(`${path}`, payload);
const getMessages = async (query = "") => axios.get(query ? `${path}?${query}` : path);

const messagesApi = { create, getMessages };

export default messagesApi

