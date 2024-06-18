// src/common/apis/messagesApi.js
import axios from "../apiService";

const path = "/messages";

const create = async (payload) => axios.post(`${path}`, payload);
const getMessages = async (query = "") => axios.get(query ? `${path}?${query}` : path);
const typing = async (payload) => axios.post(`${path}/typing`, payload)
const messagesApi = { create, getMessages, typing };

export default messagesApi;
