import { USER_SEED_KEYS, UserSeedKey } from "../User/user.const";
import { TSocialMedia } from "../User/socialLinkSchema";

const defaultSocialMedia: TSocialMedia = {
  facebook: "",
  x: "",
  instagram: "",
  linkedin: "",
};

export type SampleClubProfileSeed = {
  seedKey: UserSeedKey;
  about: string;
  cludeName: string;
  location: string;
  clubeOverview: string;
  playersResponded: number;
  successTransfers: number;
  socialMedia: TSocialMedia;
};

export const sampleClubProfiles: SampleClubProfileSeed[] = [
  {
    seedKey: USER_SEED_KEYS.CLUB,
    about: "Community-driven club developing local talent for national competitions.",
    cludeName: "City Football Club",
    location: "Sylhet, Bangladesh",
    clubeOverview:
      "City FC runs academy programs, open trials, and senior squad recruitment each season.",
    playersResponded: 12,
    successTransfers: 4,
    socialMedia: {
      ...defaultSocialMedia,
      facebook: "https://facebook.com/cityfootballclub",
    },
  },
];
