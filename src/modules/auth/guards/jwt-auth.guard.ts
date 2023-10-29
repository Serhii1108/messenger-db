import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader: string = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException();

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token || typeof token !== 'string') {
      throw new UnauthorizedException();
    }

    const secret = process.env.JWT_SECRET_KEY;
    try {
      this.jwtService.verify(token, { secret });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
