import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import jwt from 'jsonwebtoken';

const jwtSecret = 'secret code';

export const GetUser = createParamDecorator(
  (field: string, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest();

    if (field) {
      if (!request.user && field === '_id') {
        const headers = request.headers;

        if (headers) {
          try {
            let authToken =
              headers.authorization && headers.authorization.split(' ')[1];
            if (!authToken) {
              const cookies: string[] = headers.cookie.split('; ');
              authToken = cookies
                .find((cookie) => cookie.startsWith('accessToken'))
                ?.split('=')[1];
            }
            const payload: any = jwt.verify(authToken, jwtSecret);

            return payload.user;
          } catch (error) {
            return null;
          }
        }
      }

      if (request.user) {
        return request.user[field];
      }
    }

    return request.user;
  },
);
