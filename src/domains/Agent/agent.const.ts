import { USER_SEED_KEYS, UserSeedKey } from "../User/user.const";
import { TSocialMedia } from "../User/socialLinkSchema";

const defaultSocialMedia: TSocialMedia = {
  facebook: "",
  x: "",
  instagram: "",
  linkedin: "",
};

export type SampleAgentProfileSeed = {
  seedKey: UserSeedKey;
  about: string;
  location: number;
  service: {
    serviceName: string;
    description: string;
  };
  areaOfExpertise: string[];
  experiences: string;
  socialMedia: TSocialMedia;
};

export const sampleAgentProfiles: SampleAgentProfileSeed[] = [
  {
    seedKey: USER_SEED_KEYS.AGENT,
    about: "FIFA intermediary helping players secure trials and professional contracts.",
    location: 1,
    service: {
      serviceName: "Player Representation",
      description: "Contract negotiation, trial placement, and career management.",
    },
    areaOfExpertise: ["Contract Negotiation", "Trial Placement", "Youth Scouting"],
    experiences: "Represented 20+ players across domestic and regional leagues",
    socialMedia: {
      ...defaultSocialMedia,
      x: "https://x.com/adamagent",
    },
  },
];
