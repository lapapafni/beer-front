const API_URL = "/api/beers";

import { apiFetch } from "./main"; 
                                     
export const getAllBeers = async (
  page: number = 1,
  limit: number = 9,
  sort: string = "createdAt",
  order: "ASC" | "DESC" = "DESC",
  rated?: boolean,
  searchValue: string = ""
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort,
    order,
  });

  if (rated !== undefined) {
    params.append("rated", rated.toString());
  }

  if (searchValue.trim()) {
    params.append("search", searchValue);
  }

  return apiFetch(`${API_URL}?${params.toString()}`);
};


export const getBeerById = async (id: number) => {
  return apiFetch(`${API_URL}/${id}`);
};

export const createBeer = async (formData: FormData) => {
  return apiFetch(API_URL, {
    method: "POST",
    body: formData,
    headers: {} 
  });
};



export const updateBeer = async (id: number, formData: FormData) => {
  return apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
    headers: {} // Не устанавливаем Content-Type для FormData
  });
};


export const deleteBeer = async (id: number) => {
  return apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};

