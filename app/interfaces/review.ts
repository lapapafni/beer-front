import { User } from "./user";

export interface Review {
  id: number;
  User: User;
  content: string;
  apperanceScore: number;
  aromaScore: number;
  tasteScore: number;
  aftertasteScore: number;
  createdAt: string;
  updatedAt: string;
  beerId: number;
  userId: number;
}

export interface ReviewsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Review[];
}