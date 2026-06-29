import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { UsersHandler } from './handlers/users.handler';
import { PetsHandler } from './handlers/pets.handler';
import { PetsImgHandler } from './handlers/petsImg.handler';
import { ImagesHandler } from './handlers/images.handler';
import { ImagesItemHandler } from './handlers/imagesItem.handler';
import { EmailHandler } from './handlers/email.handler';
import { PetsAllUserHandler } from './handlers/petsAllUser.handler';
import { NotificationsHandler } from './handlers/notifications.handler';
import { PawsCountHandler } from './handlers/pawsCount.handler';
import { LikesCountHandler } from './handlers/likesCount.handler';
import { VideosCountHandler } from './handlers/videosCount.handler';
import { ImagesCountHandler } from './handlers/imagesCount.handler';
import { CommentsCountHandler } from './handlers/commentsCount.handler';
import { TasksByUserHandler } from './handlers/tasksByUser.handler';
import { RankingHandler } from './handlers/ranking.handler';
import { MyAllActivitiesHandler } from './handlers/myAllActivities.handler';
import { TokenHandler } from './handlers/token.handler';
import { SurveyHandler } from './handlers/survey.handler';
import { PetshopLikesHandler } from './handlers/petshopLikes.handler';
import { RefugiosLikesHandler } from './handlers/refugiosLikes.handler';
import { CenterVetLikesHandler } from './handlers/centerVetLikes.handler';
import { EventLikesHandler } from './handlers/eventLikes.handler';
import { BusinessFavoriteHandler } from './handlers/businessFavorite.handler';

@Injectable()
export class SearchService {
  constructor(
    private readonly usersHandler: UsersHandler,
    private readonly petsHandler: PetsHandler,
    private readonly petsImgHandler: PetsImgHandler,
    private readonly imagesHandler: ImagesHandler,
    private readonly imagesItemHandler: ImagesItemHandler,
    private readonly emailHandler: EmailHandler,
    private readonly petsAllUserHandler: PetsAllUserHandler,
    private readonly notificationsHandler: NotificationsHandler,
    private readonly pawsCountHandler: PawsCountHandler,
    private readonly likesCountHandler: LikesCountHandler,
    private readonly videosCountHandler: VideosCountHandler,
    private readonly imagesCountHandler: ImagesCountHandler,
    private readonly commentsCountHandler: CommentsCountHandler,
    private readonly tasksByUserHandler: TasksByUserHandler,
    private readonly rankingHandler: RankingHandler,
    private readonly myAllActivitiesHandler: MyAllActivitiesHandler,
    private readonly tokenHandler: TokenHandler,
    private readonly surveyHandler: SurveyHandler,
    private readonly petshopLikesHandler: PetshopLikesHandler,
    private readonly refugiosLikesHandler: RefugiosLikesHandler,
    private readonly centerVetLikesHandler: CenterVetLikesHandler,
    private readonly eventLikesHandler: EventLikesHandler,
    private readonly businessFavoriteHandler: BusinessFavoriteHandler,
  ) {}

  // 🔥 ORQUESTADOR DINÁMICO (sin switch)
  private handlers = {
    users: (term: string) => this.usersHandler.search(term),
    pets: (term: string) => this.petsHandler.search(term),
    petsImg: (term: string) => this.petsImgHandler.search(term),
    images: (term: string) => this.imagesHandler.search(term),
    imagesItem: (term: string) => this.imagesItemHandler.search(term),
    emails: (term: string) => this.emailHandler.search(term),
    petsalluser: (term: string) => this.petsAllUserHandler.search(term),
    notifications: (term: string) => this.notificationsHandler.search(term),
    pawsCount: (term: string) => this.pawsCountHandler.search(term),
    likesCount: (term: string) => this.likesCountHandler.search(term),
    videosCount: (term: string) => this.videosCountHandler.search(term),
    imagesCount: (term: string) => this.imagesCountHandler.search(term),
    commentsCount: (term: string) => this.commentsCountHandler.search(term),
    tasksByUser: (term: string) => this.tasksByUserHandler.search(term),
    ranking: (term: string) => this.rankingHandler.search(term),
    myAllActivities: (term: string) => this.myAllActivitiesHandler.search(term),
    tokenQntty: (term: string) => this.tokenHandler.search(term),
    surveyInitial: (term: string) => this.surveyHandler.search(term),
    petshopLikes: (term: string) => this.petshopLikesHandler.search(term),
    refugiosLikes: (term: string) => this.refugiosLikesHandler.search(term),
    centervetLikes: (term: string) => this.centerVetLikesHandler.search(term),
    eventLikes: (term: string) => this.eventLikesHandler.search(term),
    businessFavorite: (term: string) =>
      this.businessFavoriteHandler.search(term),
  };

  async search(collection: string, term: string) {
    const handler = this.handlers[collection];

    if (!handler) {
      throw new BadRequestException('La collection no existe');
    }

    try {
      return await handler(term);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error en búsqueda');
    }
  }
}