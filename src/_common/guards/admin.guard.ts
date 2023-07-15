import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminPermissions } from 'src/users/enums/admin-permissions';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private role: AdminPermissions) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const isAdmin = user.admin?.includes(this.role);

    if (!isAdmin) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return isAdmin;
  }
}
