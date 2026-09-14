import axios from "axios";
import config from "../config";
import { helperApiQuery } from "../utils/helpers";

const ENDPOINT = "/products";

const list = (params) => {
  return axios.get(helperApiQuery(`${config.BASE_URL}${ENDPOINT}`, params));
};

const getById = (id) => {
  return axios.get(`${config.BASE_URL}${ENDPOINT}/${id}`);
};

const getCategories = () => {
  return axios.get(`${config.BASE_URL}${ENDPOINT}/categories`);
};

const getByCategory = (category, params) => {
  return axios.get(
    helperApiQuery(
      `${config.BASE_URL}${ENDPOINT}/category/${encodeURIComponent(category)}`,
      params
    )
  );
};

const create = (product) => {
  return axios.post(`${config.BASE_URL}${ENDPOINT}`, product);
};

const update = (id, product) => {
  return axios.put(`${config.BASE_URL}${ENDPOINT}/${id}`, product);
};

const patch = (id, product) => {
  return axios.patch(`${config.BASE_URL}${ENDPOINT}/${id}`, product);
};

const remove = (id) => {
  return axios.delete(`${config.BASE_URL}${ENDPOINT}/${id}`);
};

export default {
  list,
  getById,
  getCategories,
  getByCategory,
  create,
  update,
  patch,
  remove,
};
