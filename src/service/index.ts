import Agent from "../domains/Agent/agent.model";
import Club from "../domains/Club/club.model";
import coachModel from "../domains/Coach/coach.model";
import Player from "../domains/Players/players.model";
import User from "../domains/User/user.model";
import BaseService from "./DBService";


const UserBaseService = new BaseService(User);
const PlayerBaseService = new BaseService(Player);
const CoachBaseService = new BaseService(coachModel.Coach);
const CoachTimeSlotBaseService = new BaseService(coachModel.TimeSlot);
const ClubBaseService = new BaseService(Club);
const AgentBaseService = new BaseService(Agent);


export { AgentBaseService, ClubBaseService, CoachBaseService, CoachTimeSlotBaseService, PlayerBaseService, UserBaseService };

