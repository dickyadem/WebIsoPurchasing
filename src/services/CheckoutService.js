import axios from "axios";
import config from "../config";
import { helperApiQuery } from "../utils/helpers";

const ENDPOINT = "/carts";

const list = (params) => {
  return axios.get(helperApiQuery(`${config.BASE_URL}${ENDPOINT}`, params));
};

const getById = (id) => {
  return axios.get(`${config.BASE_URL}${ENDPOINT}/${id}`);
};

const getByUser = (userId) => {
  return axios.get(`${config.BASE_URL}${ENDPOINT}/user/${userId}`);
};

const create = (checkout) => {
  return axios.post(`${config.BASE_URL}${ENDPOINT}`, checkout);
};

const update = (id, checkout) => {
  return axios.put(`${config.BASE_URL}${ENDPOINT}/${id}`, checkout);
};

const patch = (id, checkout) => {
  return axios.patch(`${config.BASE_URL}${ENDPOINT}/${id}`, checkout);
};

const remove = (id) => {
  return axios.delete(`${config.BASE_URL}${ENDPOINT}/${id}`);
};

export default {
  list,
  getById,
  getByUser,
  create,
  update,
  patch,
  remove,
};
