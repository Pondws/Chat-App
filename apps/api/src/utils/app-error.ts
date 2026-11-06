// Error ที่เรา "ตั้งใจ" โยนเอง พร้อม HTTP status code
// error middleware จะเอา statusCode ไปตอบกลับ client
export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}
