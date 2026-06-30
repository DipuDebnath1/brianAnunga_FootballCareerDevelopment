import Agent from "../domains/Agent/agent.model";
import Club from "../domains/Club/club.model";
import coachModel from "../domains/Coach/coach.model";
import Player from "../domains/Players/players.model";
import PlayerConsultationRequest from "../domains/PlayerConsultation/PlayerConsultation.model";
import PlayerPlacement from "../domains/PlayerPlaceRequest/PlayerPlaceRequest.model";
import PlayerVideoRequest from "../domains/PlayerVideoRequests/PlayerVideoRequests.model";
import Rating from "../domains/Ratings/rating.model";
import User from "../domains/User/user.model";
import Wallet from "../domains/wallet/wallet.model";
import BaseService from "./DBService";


const UserBaseService = new BaseService(User);
const PlayerBaseService = new BaseService(Player);
const CoachBaseService = new BaseService(coachModel.Coach);
const CoachTimeSlotBaseService = new BaseService(coachModel.TimeSlot);
const ClubBaseService = new BaseService(Club);
const AgentBaseService = new BaseService(Agent);
const PlayerVideoRequestBaseService = new BaseService(PlayerVideoRequest);
const PlayerPlacementBaseService = new BaseService(PlayerPlacement);
const PlayerConsultationBaseService = new BaseService(PlayerConsultationRequest);
const RatingBaseService = new BaseService(Rating);
const WalletBaseService = new BaseService(Wallet);


export {
  AgentBaseService,
  ClubBaseService,
  CoachBaseService,
  CoachTimeSlotBaseService,
  PlayerBaseService,
  PlayerConsultationBaseService,
  PlayerPlacementBaseService,
  PlayerVideoRequestBaseService,
  RatingBaseService,
  UserBaseService,
  WalletBaseService
};

