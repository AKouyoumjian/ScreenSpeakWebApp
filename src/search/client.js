import axios from "axios";
export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const REV_API = `${BASE_API}/api/reviews`;
export const REP_API = `${BASE_API}/api/responses`;
export const SCR_API = `${BASE_API}/api/screenings`;

const request = axios.create({
 withCredentials: true,
});

export const findAllReviews = async () => {
 const response = await request.get(`${REV_API}`);
 return response.data;
};
export const createReview = async (rev) => {
 const response = await request.post(`${REV_API}`, rev);
 return response.data;
};
export const findAllResponses = async () => {
 const response = await request.get(`${REP_API}`);
 return response.data;
};
export const createResponse = async (rep) => {
 const response = await request.post(`${REP_API}`, rep);
 return response.data;
};
export const findAllScreenings = async () => {
 const response = await request.get(`${SCR_API}`);
 return response.data;
};
export const createScreening = async (sc) => {
 const response = await request.post(`${SCR_API}`, sc);
 return response.data;
};
export const updateScreening = async (sc) => {
 const response = await request.put(`${SCR_API}/${sc._id}`, sc);
 return response.data;
};
