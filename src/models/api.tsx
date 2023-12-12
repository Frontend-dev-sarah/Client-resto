import { IDXOptional } from "idx";

export type HeadersData = {
  authorization?: string;
  "Auth-Email"?: string;
  "Auth-Password"?: string;
};

export type ErrorData = {
  name?: string;
  status?: string;
  message?: string;
  statusCode?: IDXOptional<string>;
  data?: IDXOptional<ErrorData>;
  headers?: IDXOptional<string>;
  type?: IDXOptional<string>;
  req?: { path: string; body: object; options: object };
  error_type?: string;
};

export type ErrorResponse = {
  response: ErrorData;
  code: number | string;
};

export type OptionsData = {
  headers?: object;
};
