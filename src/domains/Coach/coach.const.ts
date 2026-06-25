import { USER_SEED_KEYS, UserSeedKey } from "../User/user.const";
import { TSocialMedia } from "../User/socialLinkSchema";

const defaultSocialMedia: TSocialMedia = {
  facebook: "",
  x: "",
  instagram: "",
  linkedin: "",
};

export type SampleCoachProfileSeed = {
  seedKey: UserSeedKey;
  about: string;
  location: string;
  service: {
    title: string;
    description: string;
  };
  consultationFee: number;
  videoReviewFee: number;
  areaOfExpertise: string[];
  coachExperiences: string;
  coachingPhilosophy: string;
  socialMedia: TSocialMedia;
};

export const sampleCoachProfiles: SampleCoachProfileSeed[] = [
  {
    seedKey: USER_SEED_KEYS.COACH,
    about: "UEFA licensed coach focused on youth development and tactical awareness.",
    location: "Chattogram, Bangladesh",
    service: {
      title: "1-on-1 Coaching",
      description: "Personalized training plans and match analysis for aspiring players.",
    },
    consultationFee: 50,
    videoReviewFee: 30,
    areaOfExpertise: ["Tactics", "Fitness", "Youth Development"],
    coachExperiences: "8 years coaching academy and semi-pro teams",
    coachingPhilosophy: "Build smart players who understand space, tempo, and teamwork.",
    socialMedia: {
      ...defaultSocialMedia,
      linkedin: "https://linkedin.com/in/chriscoach",
    },
  },
];
