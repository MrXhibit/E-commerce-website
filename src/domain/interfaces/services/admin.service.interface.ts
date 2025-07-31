import { validAdminResponseType } from "@/domain/types";

export interface adminServiceInterface {
  loginAdmin(RequestBody: unknown): Promise<validAdminResponseType>;
  adminRefreshToken(refresh_token: string): Promise<validAdminResponseType>;
}
