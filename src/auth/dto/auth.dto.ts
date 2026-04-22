export class SendCodeDto {
  email: string;
}

export class RegisterDto {
  email: string;
  password: string;
  code: string;
}

export class LoginDto {
  email: string;
  password: string;
}
