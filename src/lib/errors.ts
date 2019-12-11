class RequestError extends Error {
  public message: string
  public statusCode: number

  constructor(message: string, statusCode: number = null) {
    super(message)

    this.message = message
    this.statusCode = statusCode
  }

  public toString = () =>
    this.statusCode ? `[${this.statusCode}] ${this.message}` : this.message
}

export { RequestError }
