import { apiFetch } from "./main";

const API_URL = "/api/reviews";

export const getByBeer = async (beerId: number) => {
  return apiFetch(`${API_URL}/beers/${beerId}/reviews`);
};

export const getByUser = async (userId: number) => {
  return apiFetch(`${API_URL}/users/${userId}/reviews`);
};


export const getReviewById = async (id: number) => {
  return apiFetch(`${API_URL}/${id}`);
};


export const createReview = async (reviewData: {
  content: string;
  beerId: number;
  apperanceScore?: number;
  aromaScore?: number;
  tasteScore?: number;
  aftertasteScore?: number;
}) => {
  return apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
};

export const updateReview = async (
  id: number,
  reviewData: Partial<{
    content: string;
    apperanceScore: number;
    aromaScore: number;
    tasteScore: number;
    aftertasteScore: number;
  }>
) => {
  return apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
};

export const deleteReview = async (id: number) => {
  return apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
