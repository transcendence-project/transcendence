import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext) {
		const result = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return result;
	}
	handleRequest(err, user, info) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}