import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateJwt } from '../../common/helpers/generate-jwt';

type UpdateUserData = Partial<{
  nombre: string;
  sexo: string;
  latitude: number;
  longitude: number;
  edad: Date;
  role: string;
  status: boolean;
  google: boolean;
  password: string;
}>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly pageSize = 20;

  async findAll(page: number) {
    const totalDocs = await this.prisma.user.count({
      where: { status: true },
    });

    const totalPages = Math.ceil(totalDocs / this.pageSize);

    const docs = await this.prisma.user.findMany({
      where: { status: true },
      skip: (page - 1) * this.pageSize,
      take: this.pageSize,
    });

    const sanitizedDocs = docs.map(({ password, ...user }) => user);

    return {
      docs: sanitizedDocs,
      totalDocs,
      limit: this.pageSize,
      totalPages,
      page,
      pagingCounter: (page - 1) * this.pageSize + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async create(dto: CreateUserDto) {
    try {
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(dto.password, salt);

      let formattedEdad: Date | undefined = undefined;

      if (dto.edad) {
        formattedEdad = new Date(dto.edad);
        if (isNaN(formattedEdad.getTime())) {
          throw new InternalServerErrorException('Formato de fecha inválido');
        }
      }

      const newUser = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
          edad: formattedEdad,
        },
      });

      const { password, ...sanitizedUser } = newUser;

      const token = await generateJwt(newUser.uid);

      return { user: sanitizedUser, token };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creando usuario');
    }
  }

async update(id: string, dto: UpdateUserDto) {
  const { password, google, email, edad, ...restFields } = dto;

  const rest: UpdateUserData = { ...restFields };

  // convertir edad si viene
  if (edad) {
    const parsedDate = new Date(edad);

    if (isNaN(parsedDate.getTime())) {
      throw new InternalServerErrorException('Formato de fecha inválido');
    }

    rest.edad = parsedDate;
  }

  if (password) {
    rest.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
  }

  try {
    const updatedUser = await this.prisma.user.update({
      where: { uid: id },
      data: rest,
    });

    const { password, ...sanitizedUser } = updatedUser;

    return sanitizedUser;
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Error al actualizar usuario');
  }
}

  async remove(id: string) {
    try {
      const deletedUser = await this.prisma.user.update({
        where: { uid: id },
        data: { status: false },
      });

      const { password, ...sanitizedUser } = deletedUser;

      return sanitizedUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar usuario');
    }
  }
}