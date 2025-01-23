import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { HashService } from './hash.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService
  ) {}

  async signIn(signInDto: SigninAuthDto) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Credentials is invalid');
    }
    const isValidPassword = await this.hashService.compare(signInDto.password, user.password);

    if (! isValidPassword ) {
      throw new UnauthorizedException('Credentials is invalid');
    }

    const payload = { sub: user.id, name: user.name, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(
        payload,
        this.jwtConfiguration.signOptions,
      ),
    };
  }
}
