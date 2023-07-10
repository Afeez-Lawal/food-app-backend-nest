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

    const jwtPayload = {
      name: user.name,
      email: user.email,
      sub: user._id,
      image: user.image,
    };

    return {
      token: this.jwtService.sign(jwtPayload),
    };
  }
}
