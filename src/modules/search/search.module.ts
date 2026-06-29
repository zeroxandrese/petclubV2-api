import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

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

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    UsersHandler,
    PetsHandler,
    PetsImgHandler,
    ImagesHandler,
    ImagesItemHandler,
    EmailHandler,
    PetsAllUserHandler,
    NotificationsHandler,
    PawsCountHandler,
    LikesCountHandler,
    VideosCountHandler,
    ImagesCountHandler,
    CommentsCountHandler,
    TasksByUserHandler,
    RankingHandler,
    MyAllActivitiesHandler,
    TokenHandler,
    SurveyHandler,
    PetshopLikesHandler,
    RefugiosLikesHandler,
    CenterVetLikesHandler,
    EventLikesHandler,
    BusinessFavoriteHandler,
  ],
})
export class SearchModule {}