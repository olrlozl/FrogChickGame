class HttpError extends Error {
  code: number;
  type: string;
  constructor(message: string, errorCode: number, errorType: string) {
    super(message);
    this.code = errorCode;
    this.type = errorType;
  }
}

export default HttpError;
