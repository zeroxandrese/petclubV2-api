import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as CryptoJS from 'crypto-js';

const radioKm = 5;

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // HELPERS
  // =========================

  private decryptPhone(encryptedPhone: string) {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPhone,
      process.env.secretKeyCrypto!,
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private calculateGeoQuery(latitude: number, longitude: number) {
    return [
      {
        latitude: {
          gte: latitude - (1 / 111) * radioKm,
          lte: latitude + (1 / 111) * radioKm,
        },
      },
      {
        longitude: {
          gte:
            longitude -
            (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
          lte:
            longitude +
            (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
        },
      },
    ];
  }

  // =========================
  // PET LOST
  // =========================

  async searchImagesLost(query: any) {
    try {
      const { latPunto, lonPunto } = query;

      const latitude = latPunto ? parseFloat(latPunto) : null;
      const longitude = lonPunto ? parseFloat(lonPunto) : null;

      const isValidLatitude = latitude !== null && !isNaN(latitude);
      const isValidLongitude = longitude !== null && !isNaN(longitude);

      let prismaQuery: any = {
        where: {
          status: true,
          actionPlan: 'LOST',
        },
      };

      if (isValidLatitude && isValidLongitude) {
        prismaQuery.where.AND = [
          {
            lantitudeEvento: {
              gte: latitude - (1 / 111) * radioKm,
              lte: latitude + (1 / 111) * radioKm,
            },
          },
          {
            longitudeEvento: {
              gte:
                longitude -
                (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
              lte:
                longitude +
                (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
            },
          },
        ];
      }

      const images = await this.prisma.image.findMany(prismaQuery);

      const responseImages = images.map((image) => ({
        ...image,
        phone: image.phone ? this.decryptPhone(image.phone) : '0',
      }));

      return { status: 201, body: { images: responseImages } };
    } catch (error) {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

    async cardOpeningImagesLost(userId: string, id: string, interaction: number) {
    try {
      if (!interaction) {
        return {
          status: 401,
          body: { msg: 'Necesita cargar una interaction' },
        };
      }

      const cardOpening =
        await this.prisma.cardOpeningsPetLost.create({
          data: { user: userId, imagePetLostID: id, interaction },
        });

      return { status: 201, body: cardOpening };
    } catch {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

  // =========================
  // REFUGIOS
  // =========================

  async searchShelters(query: any) {
    try {
      const { latPunto, lonPunto } = query;

      const latitude = latPunto ? parseFloat(latPunto) : null;
      const longitude = lonPunto ? parseFloat(lonPunto) : null;

      const isValidLatitude = latitude !== null && !isNaN(latitude);
      const isValidLongitude = longitude !== null && !isNaN(longitude);

      let prismaQuery: any = {
        where: { status: true },
      };

      if (isValidLatitude && isValidLongitude) {
        prismaQuery.where.AND = this.calculateGeoQuery(
          latitude,
          longitude,
        );
      }

      const refugios =
        await this.prisma.elementMapRefugios.findMany(prismaQuery);

      return { status: 201, body: { refugios } };
    } catch {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

  async cardOpeningShelters(userId: string, id: string, interaction: number) {
    try {
      if (!interaction) {
        return {
          status: 401,
          body: { msg: 'Necesita cargar una interaction' },
        };
      }

      const cardOpening =
        await this.prisma.cardOpeningsRefugios.create({
          data: { user: userId, refugioId: id, interaction },
        });

      return { status: 201, body: cardOpening };
    } catch {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

  async whatsAppShelters(userId: string, id: string, interaction: number) {
    try {
      if (!interaction) {
        return {
          status: 401,
          body: { msg: 'Necesita cargar una interaction' },
        };
      }

      const response =
        await this.prisma.whatsAppRedirectsRefugios.create({
          data: { user: userId, refugioId: id, interaction },
        });

      return { status: 201, body: response };
    } catch {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

  async likesShelters(userId: string, id: string, like: number) {
    try {
      if (!like) {
        return {
          status: 401,
          body: { msg: 'Necesita cargar un like' },
        };
      }

      const existingLike =
        await this.prisma.likesRefugios.findFirst({
          where: { user: userId, refugioId: id },
        });

      if (existingLike) {
        return {
          status: 201,
          body: {
            msg: 'El like ya existe para este evento.',
            likes: existingLike,
          },
        };
      }

      const likes = await this.prisma.likesRefugios.create({
        data: { user: userId, refugioId: id, like },
      });

      const dataValidation =
        await this.prisma.countLikesRefugios.findFirst({
          where: { refugioId: id },
        });

      if (dataValidation) {
        await this.prisma.countLikesRefugios.update({
          where: { uid: dataValidation.uid },
          data: { likes: (dataValidation.likes || 0) + 1 },
        });
      } else {
        await this.prisma.countLikesRefugios.create({
          data: { refugioId: id, likes: 1 },
        });
      }

      return { status: 201, body: likes };
    } catch {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

  // =========================
  // EVENT
  // =========================

  async searchEvent(query: any) {
    try {
      const { latPunto, lonPunto } = query;

      const latitude = latPunto ? parseFloat(latPunto) : null;
      const longitude = lonPunto ? parseFloat(lonPunto) : null;

      let prismaQuery: any = { where: { status: true } };

      if (latitude && longitude) {
        prismaQuery.where.AND = this.calculateGeoQuery(
          latitude,
          longitude,
        );
      }

      const elementsMap =
        await this.prisma.elementMapEvent.findMany(prismaQuery);

      return { status: 201, body: { elementsMap } };
    } catch {
      return {
        status: 500,
        body: { msg: 'Algo salió mal, contacte con el administrador' },
      };
    }
  }

  async cardOpeningEvent(userId: string, id: string, interaction: number) {
    try {
      if (!interaction)
        return { status: 401, body: { msg: 'Necesita cargar una interaction' } };

      const result = await this.prisma.cardOpeningsEvent.create({
        data: { user: userId, eventId: id, interaction },
      });

      return { status: 201, body: result };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async whatsAppEvent(userId: string, id: string, interaction: number) {
    try {
      if (!interaction)
        return { status: 401, body: { msg: 'Necesita cargar una interaction' } };

      const result = await this.prisma.whatsAppRedirectsEvent.create({
        data: { user: userId, eventId: id, interaction },
      });

      return { status: 201, body: result };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async likesEvent(userId: string, id: string, like: number) {
    try {
      if (!like)
        return { status: 401, body: { msg: 'Necesita cargar un like' } };

      const existingLike = await this.prisma.likesEvent.findFirst({
        where: { user: userId, eventId: id },
      });

      if (existingLike) {
        return {
          status: 201,
          body: { msg: 'El like ya existe para este evento.', likes: existingLike },
        };
      }

      const likes = await this.prisma.likesEvent.create({
        data: { user: userId, eventId: id, like },
      });

      const dataValidation = await this.prisma.countLikesEvent.findFirst({
        where: { eventId: id },
      });

      if (dataValidation) {
        await this.prisma.countLikesEvent.update({
          where: { uid: dataValidation.uid },
          data: { likes: (dataValidation.likes || 0) + 1 },
        });
      } else {
        await this.prisma.countLikesEvent.create({
          data: { eventId: id, likes: 1 },
        });
      }

      return { status: 201, body: likes };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  // =========================
  // PETSHOP
  // =========================

  async searchPetShop(query: any) {
    try {
      const { latPunto, lonPunto } = query;
      const latitude = latPunto ? parseFloat(latPunto) : null;
      const longitude = lonPunto ? parseFloat(lonPunto) : null;

      let prismaQuery: any = { where: { status: true } };

      if (latitude && longitude) {
        prismaQuery.where.AND = this.calculateGeoQuery(latitude, longitude);
      }

      const elementsMap =
        await this.prisma.elementMapPetshops.findMany(prismaQuery);

      return { status: 201, body: { elementsMap } };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async cardOpeningPetShop(userId: string, id: string, interaction: number) {
    try {
      if (!interaction)
        return { status: 401, body: { msg: 'Necesita cargar una interaction' } };

      const result = await this.prisma.cardOpeningsPetshops.create({
        data: { user: userId, petshopId: id, interaction },
      });

      return { status: 201, body: result };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async whatsAppPetShop(userId: string, id: string, interaction: number) {
    try {
      if (!interaction)
        return { status: 401, body: { msg: 'Necesita cargar una interaction' } };

      const result = await this.prisma.whatsAppRedirectsPetshops.create({
        data: { user: userId, petshopId: id, interaction },
      });

      return { status: 201, body: result };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async likesPetShop(userId: string, id: string, like: number) {
    try {
      if (!like)
        return { status: 401, body: { msg: 'Necesita cargar un like' } };

      const existingLike = await this.prisma.likesPetshops.findFirst({
        where: { user: userId, petshopId: id },
      });

      if (existingLike) {
        return {
          status: 201,
          body: { msg: 'El like ya existe para este evento.', likes: existingLike },
        };
      }

      const likes = await this.prisma.likesPetshops.create({
        data: { user: userId, petshopId: id, like },
      });

      const dataValidation =
        await this.prisma.countLikesPetshop.findFirst({
          where: { petshopId: id },
        });

      if (dataValidation) {
        await this.prisma.countLikesPetshop.update({
          where: { uid: dataValidation.uid },
          data: { likes: (dataValidation.likes || 0) + 1 },
        });
      } else {
        await this.prisma.countLikesPetshop.create({
          data: { petshopId: id, likes: 1 },
        });
      }

      return { status: 201, body: likes };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  // =========================
  // VET CENTER
  // =========================

  async searchVetCenter(query: any) {
    try {
      const { latPunto, lonPunto } = query;
      const latitude = latPunto ? parseFloat(latPunto) : null;
      const longitude = lonPunto ? parseFloat(lonPunto) : null;

      let prismaQuery: any = { where: { status: true } };

      if (latitude && longitude) {
        prismaQuery.where.AND = this.calculateGeoQuery(latitude, longitude);
      }

      const elementsMap =
        await this.prisma.elementMapcenterVet.findMany(prismaQuery);

      return { status: 201, body: { elementsMap } };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async cardOpeningVetCenter(userId: string, id: string, interaction: number) {
    try {
      if (!interaction)
        return { status: 401, body: { msg: 'Necesita cargar una interaction' } };

      const result =
        await this.prisma.cardOpeningsCenterVet.create({
          data: { user: userId, centerVetId: id, interaction },
        });

      return { status: 201, body: result };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async whatsAppVetCenter(userId: string, id: string, interaction: number) {
    try {
      if (!interaction)
        return { status: 401, body: { msg: 'Necesita cargar una interaction' } };

      const result =
        await this.prisma.whatsAppRedirectsCenterVet.create({
          data: { user: userId, centerVetId: id, interaction },
        });

      return { status: 201, body: result };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }

  async likesVetCenter(userId: string, id: string, like: number) {
    try {
      if (!like)
        return { status: 401, body: { msg: 'Necesita cargar un like' } };

      const existingLike =
        await this.prisma.likesCenterVet.findFirst({
          where: { user: userId, centerVetId: id },
        });

      if (existingLike) {
        return {
          status: 201,
          body: { msg: 'El like ya existe para este evento.', likes: existingLike },
        };
      }

      const likes = await this.prisma.likesCenterVet.create({
        data: { user: userId, centerVetId: id, like },
      });

      const dataValidation =
        await this.prisma.countLikesCenterVet.findFirst({
          where: { centerVetId: id },
        });

      if (dataValidation) {
        await this.prisma.countLikesCenterVet.update({
          where: { uid: dataValidation.uid },
          data: { likes: (dataValidation.likes || 0) + 1 },
        });
      } else {
        await this.prisma.countLikesCenterVet.create({
          data: { centerVetId: id, likes: 1 },
        });
      }

      return { status: 201, body: likes };
    } catch {
      return { status: 500, body: { msg: 'Algo salió mal, contacte con el administrador' } };
    }
  }
}