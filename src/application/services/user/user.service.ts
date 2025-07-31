import { AuthorizeError, User, ValidationError } from "@/domain/entities";
import { userRepositoryInterface } from "@/domain/interfaces/repository";
import { userServiceInterface } from "@/domain/interfaces/services";
import { authUtillsInterface } from "@/domain/interfaces/utills";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utills/token.validation.utills.interface";
import { validUserResponseType } from "@/domain/types";

export class userService implements userServiceInterface {
  constructor(
    private userRepository: userRepositoryInterface,
    private authUtills: authUtillsInterface,
    private tokenUtils: tokenValidationUtillsInterface,
  ) {}
  async refreshToken(refreshToken: string): Promise<validUserResponseType> {
    //cheak the refreshToken valid or not
    const tokenProps = this.tokenUtils.isValidUserToken(refreshToken);
    //get user with userid
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const user = await this.userRepository.getUserById(tokenProps.payload.id);
      //generate accesstToken and refresh token
      const access_token = this.authUtills.generateAcessToken(user.email, user.id);
      const refresh_token = this.authUtills.generateRefreshToken(user.id);
      return {
        access_token,
        refresh_token,
        user: user.sanitizeUser(),
      };
    }
    throw new AuthorizeError();
  }

  async registerUser(requestBody: unknown): Promise<validUserResponseType> {
    const userInput = this.authUtills.validateUserRegisterInput(requestBody);
    const existUser = await this.userRepository.getUserByEmail(userInput.email);
    if (existUser) throw new ValidationError("email already exist");
    const userName = userInput.email.split("@")[0];
    const salt = await this.authUtills.getSalt();
    const hashedPassword = await this.authUtills.getHashedPassword(userInput.password, salt);
    const user = new User("", userName, userInput.email, false, undefined, hashedPassword, salt);
    const savedUser = await this.userRepository.saveUser(user);
    const access_token = this.authUtills.generateAcessToken(savedUser.email, savedUser.id);
    const refresh_token = this.authUtills.generateRefreshToken(savedUser.id);
    savedUser.setRefreshToken(refresh_token);
    //send email want done
    await this.userRepository.editUser(savedUser);
    return {
      access_token,
      refresh_token,
      user: savedUser.sanitizeUser(),
    };
  }
  async loginUser(requestBody: unknown): Promise<validUserResponseType> {
    //cheak the userInput valid or not
    const userInput = this.authUtills.validateUserLoginInput(requestBody);
    //get user with email
    const user = await this.userRepository.getUserByEmail(userInput.email);
    if (!user) throw new ValidationError("invalid email or password");
    const isPasswordValid = await this.authUtills.validatePassword(
      userInput.password,
      user.password!,
      user.salt!,
    );
    if (!isPasswordValid) throw new ValidationError("invalid email or password");
    //generate aceess_toekn and refresh_token
    const access_token = this.authUtills.generateAcessToken(user.email, user.id);
    const refresh_token = this.authUtills.generateRefreshToken(user.id);
    user.setRefreshToken(refresh_token);
    await this.userRepository.editUser(user);
    return {
      access_token,
      refresh_token,
      user: user.sanitizeUser(),
    };
  }
  loginViaGoogle(RequestBody: unknown): Promise<validUserResponseType> {
    throw new Error("Method not implemented.");
  }
}
