import { Request, Response, NextFunction } from "express";
import { APIError, AuthorizeError, ForbiddenError, NotFoundError, ValidationError } from "@/domain/entities";
export const handleError = (error: Error, req: Request, res: Response, next: NextFunction) => {
  let reportedError = true;
  let status = 500;
  let data = error.message;

  [APIError, AuthorizeError, NotFoundError, ValidationError, ForbiddenError].forEach((typeOfError) => {
    if (error instanceof typeOfError) {
      reportedError = false;
      data = error.message;
      status = error.status;
    }
  });

  if (error.name === "AuthenticationError" || error.message.includes("Failed")) {
    reportedError = false;
    data = "Google login failed";
    status = 400;
  }

  if (reportedError) {
    console.error(error);
  } else {
    console.warn(error);
  }

  res.status(status).json({ error: data });
  return;
};
