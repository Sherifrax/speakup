import { apiService } from "../apiService";
import { baseModule } from "../../enum/api/basemodules.enum";
import { EmployeeUrls } from "../../enum/api/employee.enum";

export interface EmployeeSearchParams {
  commonSearchString: string;
}

export interface EmployeeSearchRequest {
  params: EmployeeSearchParams;
}

export interface EmployeeDto {
  empNumber: string;
  empName: string;
  designation: string;
}

export interface EmployeeSearchResponse {
  data: EmployeeDto[];
  message?: string;
}

export const employeeSearchApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchEmployees: builder.mutation<EmployeeSearchResponse, EmployeeSearchRequest>({
      query: (body) => ({
        url: `${baseModule.common}${EmployeeUrls.SEARCH}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSearchEmployeesMutation } = employeeSearchApi;


