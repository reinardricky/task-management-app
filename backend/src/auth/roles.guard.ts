import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles for the route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;  // No roles required, so grant access
    }

    // Get the user from the request (after JWT validation)
    const { user } = context.switchToHttp().getRequest();

    // Check if the user has any of the required roles
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
