import axios, { type AxiosInstance } from 'axios'
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  Category,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskCollaboration,
  AddCollaboratorData,
  UserReport,
  TeamMemberReport,
  CompletedTasksReport,
  ApiResponse
} from '@/types'

class ApiService {
  private api: AxiosInstance;
  private baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3333";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    const response = await this.api.post("/users/register", data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post("/users/login", credentials);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.api.post("/users/logout");
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get("/users/profile");
    return response.data;
  }

  async updateProfile(
    data: Partial<User & { password?: string }>
  ): Promise<ApiResponse<User>> {
    const response = await this.api.put("/users/profile", data);
    return response.data;
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response = await this.api.get("/users");
    return response.data;
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.api.get("/categories");
    return response.data;
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await this.api.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(
    data: Omit<Category, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Category>> {
    const response = await this.api.post("/categories", data);
    return response.data;
  }

  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    const response = await this.api.put(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/categories/${id}`);
    return response.data;
  }

  async getTasks(): Promise<ApiResponse<Task[]>> {
    const response = await this.api.get("/tasks");
    return response.data;
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await this.api.get(`/tasks/${id}`);
    return response.data;
  }

  async getTasksByCategory(categoryId: string): Promise<ApiResponse<Task[]>> {
    const response = await this.api.get(`/tasks/category/${categoryId}`);
    return response.data;
  }

  async getTasksByStatus(status: string): Promise<ApiResponse<Task[]>> {
    const response = await this.api.get(`/tasks/status/${status}`);
    return response.data;
  }

  async getAssignedTasks(): Promise<ApiResponse<Task[]>> {
    const response = await this.api.get("/tasks/assigned");
    return response.data;
  }

  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    const response = await this.api.post("/tasks", data);
    return response.data;
  }

  async updateTask(
    id: string,
    data: UpdateTaskData
  ): Promise<ApiResponse<Task>> {
    const response = await this.api.put(`/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/tasks/${id}`);
    return response.data;
  }

  async addCollaborator(
    data: AddCollaboratorData
  ): Promise<ApiResponse<TaskCollaboration>> {
    const response = await this.api.post("/collaborations", data);
    return response.data;
  }

  async getTaskCollaborators(
    taskId: string
  ): Promise<ApiResponse<TaskCollaboration[]>> {
    const response = await this.api.get(`/collaborations/task/${taskId}`);
    return response.data;
  }

  async getUserCollaborations(): Promise<ApiResponse<TaskCollaboration[]>> {
    const response = await this.api.get("/collaborations/user");
    return response.data;
  }

  async removeCollaborator(
    taskId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    const response = await this.api.delete(
      `/collaborations/task/${taskId}/user/${userId}`
    );
    return response.data;
  }

  async checkPermission(
    taskId: string
  ): Promise<ApiResponse<{ permission: string | null }>> {
    const response = await this.api.get(`/collaborations/permission/${taskId}`);
    return response.data;
  }

  async getUserReport(): Promise<ApiResponse<UserReport>> {
    const response = await this.api.get("/reports/user");
    return response.data;
  }

  async getTeamReport(
    userIds: string[]
  ): Promise<ApiResponse<TeamMemberReport[]>> {
    const response = await this.api.post("/reports/team", { userIds });
    return response.data;
  }

  async getCompletedTasksInPeriod(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<ApiResponse<CompletedTasksReport>> {
    const params = new URLSearchParams({ startDate, endDate });
    if (userId) params.append("userId", userId);

    const response = await this.api.get(`/reports/completed-tasks?${params}`);
    return response.data;
  }
}

export const apiService = new ApiService()
export default apiService
