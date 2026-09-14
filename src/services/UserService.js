import axios from "axios";
import config from "../config";
import { helperApiQuery } from "../utils/helpers";

const ENDPOINT = "/users";

const list = (params) => {
  return axios.get(helperApiQuery(`${config.BASE_URL}${ENDPOINT}`, params));
};

const getById = (id) => {
  return axios.get(`${config.BASE_URL}${ENDPOINT}/${id}`);
};

const create = (user) => {
  return axios.post(`${config.BASE_URL}${ENDPOINT}`, user);
};

const update = (id, user) => {
  return axios.put(`${config.BASE_URL}${ENDPOINT}/${id}`, user);
};

const patch = (id, user) => {
  return axios.patch(`${config.BASE_URL}${ENDPOINT}/${id}`, user);
};

const remove = (id) => {
  return axios.delete(`${config.BASE_URL}${ENDPOINT}/${id}`);
};

export default {
  list,
  getById,
  create,
  update,
  patch,
  remove,
};
