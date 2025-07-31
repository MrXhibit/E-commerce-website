import { validUserResponseType } from "@/domain/types";

export interface userServiceInterface {
  registerUser(RequestBody: unknown): Promise<validUserResponseType>;
  loginUser(RequestBody: unknown): Promise<validUserResponseType>;
  loginViaGoogle(RequestBody: unknown): Promise<validUserResponseType>;
  refreshToken(refreshToken: string): Promise<validUserResponseType>;
}
