import { USER_SEED_KEYS, UserSeedKey } from "../User/user.const";
import { TSocialMedia } from "../User/socialLinkSchema";

const defaultSocialMedia: TSocialMedia = {
  facebook: "",
  x: "",
  instagram: "",
  linkedin: "",
};

export type SamplePlayerProfileSeed = {
  seedKey: UserSeedKey;
  age: number;
  position: string;
  location: string;
  currentClub: string;
  currentTeam: string;
  careerToal: string;
  keySkills: string[];
  achievements: string;
  socialMedia: TSocialMedia;
};

export const samplePlayerProfiles: SamplePlayerProfileSeed[] = [
  {
    seedKey: USER_SEED_KEYS.PLAYER,
    age: 21,
    position: "Striker",
    location: "Dhaka, Bangladesh",
    currentClub: "Dhaka United FC",
    currentTeam: "Senior Team",
    careerToal: "45 matches, 18 goals",
    keySkills: ["Finishing", "Pace", "Off-the-ball movement"],
    achievements: "Top scorer in regional youth league 2024",
    socialMedia: {
      ...defaultSocialMedia,
      instagram: "https://instagram.com/alexplayer",
    },
  },
];
