export class SignIn {
  public email: string;
  public password: string;
  public signInFrom: string;
  public deviceId: string;
  public serial: string;
  public brand: string;
  public board: string;

  constructor(value: any) {

    if(value != null) {
      this.email = value.email;
      this.password = value.password;
      this.signInFrom = value.signInFrom;
      this.deviceId = value.deviceId;
      this.serial = value.serial;
      this.brand = value.brand;
      this.board = value.board;
    } else {
      this.email = null;
      this.password = null;
      this.signInFrom = null;
      this.deviceId = null;
      this.serial = null;
      this.brand = null;
      this.board = null;
    }

  }
}
