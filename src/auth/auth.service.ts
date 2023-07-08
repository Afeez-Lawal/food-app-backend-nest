import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    );
  }

  async googleLogin(token: string): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    console.log(ticket.getPayload());

    const googlePayload = ticket.getPayload();

    if (!googlePayload) throw new UnauthorizedException('Invalid credentials');

    if (!googlePayload.sub && googlePayload.email)
      throw new UnauthorizedException('Invalid credentials');

    const name = googlePayload.name ?? googlePayload.email.split('@')[0];

    const data = {
      name,
      email: googlePayload.email,
      image: googlePayload.picture,
    };

    let user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      user = await this.userService.create(data);
    }

    const jwtPayload = { name: user.name, email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}

const payload = {
  iss: 'https://accounts.google.com',
  nbf: 1686781240,
  aud: '471773066883-70g6pqbsch6ga72f7r79ip3u5clk8ika.apps.googleusercontent.com',
  sub: '105671206041417974777',
  email: 'lafrizfz@gmail.com',
  email_verified: true,
  azp: '471773066883-70g6pqbsch6ga72f7r79ip3u5clk8ika.apps.googleusercontent.com',
  name: 'Afeez Lawal',
  picture:
    'https://lh3.googleusercontent.com/a/AAcHTtdZQiO-aZfj_W2ku-HKxiUudIneDMF_7go6OcxeHg=s96-c',
  given_name: 'Afeez',
  family_name: 'Lawal',
  iat: 1686781540,
  exp: 1686785140,
  jti: '80597410b2186563d7f43f08030a01f069d63276',
};
