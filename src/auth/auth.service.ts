import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async signup(dto:AuthDto) {
        const {email, password, name} = dto;
        
        const foundUser = await this.prisma.user.findUnique({where: {email}});
        if (foundUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await this.hashPassword(password);

        await this.prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        });
        
        return {message: 'signup successfully'}
    }

    async login(dto: AuthDto) {
        const { email, password } = dto;

        const foundUser = await this.prisma.user.findUnique({where: {email}});
        if (!foundUser) {
            throw new BadRequestException('Email address not found');
        }

        const isMatch = await this.comparePassword({password, hash: foundUser.password});
        if (!isMatch) {
            throw new BadRequestException('Wrong Credential');
        }

        const token = await this.signToken({id: foundUser.id, email: foundUser.email});

        return {token}
    }

    // async signout() {
    //     return {message: 'signout successfully'}
    // }

    async hashPassword(password: string) {
        const saltOrRound = 10;
        return await bcrypt.hash(password, saltOrRound);
    }

    async comparePassword(args: {password: string, hash: string}) {
        return await bcrypt.compare(args.password, args.hash);
    }

    async signToken(args: {id: string, email: string}) {
        const payload = args;

        return this.jwt.signAsync(payload, {secret: jwtSecret});
    }
}
