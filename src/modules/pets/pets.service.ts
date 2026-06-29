import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import NodeGeocoder from 'node-geocoder';
import CryptoJS from 'crypto-js';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  private prisma = new PrismaClient();
  private geocoder = NodeGeocoder({ provider: 'google', apiKey: process.env.key });

  private DEFAULT_PAWS = 5;
  private DEFAULT_POINTS = 5;

  private encryptPhone(phone: number) {
    return CryptoJS.AES.encrypt(phone.toString(), process.env.secretKeyCrypto!).toString();
  }

  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    try {
      const pets = await this.prisma.pet.findMany({
        where: { status: true },
        skip,
        take: pageSize,
      });
      return pets;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching pets');
    }
  }

  async findOne(uid: string) {
    const pet = await this.prisma.pet.findUnique({ where: { uid } });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async findAllOfUser(userId: string) {
    return this.prisma.pet.findMany({ where: { user: userId } });
  }

  async create(userId: string, dto: CreatePetDto, file?: Express.File) {
    try {
      let imgUrl = dto.img;

      if (file?.tempFilePath) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
        imgUrl = uploadResult.secure_url;
      }

      const pet = await this.prisma.pet.create({
        data: {
          user: userId,
          nombre: dto.nombre,
          sexo: dto.sexo,
          tipo: dto.tipo,
          edad: dto.edad ? new Date(dto.edad) : undefined,
          raza: dto.raza || 'Otro',
          descripcion: dto.descripcion,
          img: imgUrl,
        },
      });

      // Actualizar PawsCount
      const pawsCount = await this.prisma.pawsCount.findFirst({ where: { user: userId } });
      if (!pawsCount) {
        await this.prisma.pawsCount.create({
          data: { user: userId, paws: this.DEFAULT_PAWS, lastUpdate: new Date() },
        });
      } else {
        await this.prisma.pawsCount.update({
          where: { uid: pawsCount.uid },
          data: { paws: (pawsCount.paws || 0) + this.DEFAULT_PAWS, lastUpdate: new Date() },
        });
      }

      return pet;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating pet');
    }
  }

  async update(uid: string, dto: UpdatePetDto) {
    const pet = await this.prisma.pet.findUnique({ where: { uid } });
    if (!pet) throw new NotFoundException('Pet not found');

    // Lógica de reporte perdido
    if (!pet.perdido && dto.perdido) {
      if (!dto.longitudePerdida || !dto.lantitudePerdida || !dto.fechaPerdida || !dto.horaPerdida) {
        throw new BadRequestException('Faltan datos para reportar mascota perdida');
      }

      const reverseGeo = await this.geocoder.reverse({
        lat: dto.lantitudePerdida!,
        lon: dto.longitudePerdida!,
      });

      const formattedDate = new Date(dto.fechaPerdida);
      const day = formattedDate.getDate();
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const month = monthNames[formattedDate.getMonth()];
      const year = formattedDate.getFullYear();
      const finalDateStr = `${day} de ${month} del ${year}`;

      // Crear registro en Images
      await this.prisma.image.create({
        data: {
          user: pet.user,
          pet: uid,
          img: pet.img,
          descripcion: pet.descripcion,
          actionPlan: 'LOST',
          fechaEvento: new Date(dto.fechaPerdida),
          horaEvento: dto.horaPerdida,
          longitudeEvento: dto.longitudePerdida,
          lantitudeEvento: dto.lantitudePerdida,
          phone: dto['phone'] ? this.encryptPhone(dto['phone']) : '',
          namePet: pet.nombre,
          finalUserVisibleDate: finalDateStr,
          finalUserVisibleAddress: reverseGeo[0]?.formattedAddress || '',
        },
      });

      dto.perdido = true;
    }

    // Solo actualizar campos enviados
    const updateData: any = { ...dto };
    if (dto.edad) updateData.edad = new Date(dto.edad);

    const updatedPet = await this.prisma.pet.update({
      where: { uid },
      data: updateData,
    });

    return updatedPet;
  }

  async remove(uid: string) {
    const pet = await this.prisma.pet.update({
      where: { uid },
      data: { status: false },
    });
    return pet;
  }
}