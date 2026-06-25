import { ROLE, TRoles } from "../../utills/roles";

export const USER_SEED_KEYS = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  PLAYER: "player",
  COACH: "coach",
  AGENT: "agent",
  CLUB: "club",
} as const;

export type UserSeedKey = (typeof USER_SEED_KEYS)[keyof typeof USER_SEED_KEYS];

export type SampleUserSeed = {
  seedKey: UserSeedKey;
  name: string;
  email: string;
  phone: string;
  role: TRoles;
  isEmailVerified: boolean;
};

export const sampleUsers: SampleUserSeed[] = [
  {
    seedKey: USER_SEED_KEYS.SUPER_ADMIN,
    name: "Super Admin",
    email: "superadmin@football.com",
    phone: "+8801700000001",
    role: ROLE.superAdmin,
    isEmailVerified: true,
  },
  {
    seedKey: USER_SEED_KEYS.ADMIN,
    name: "Platform Admin",
    email: "admin@football.com",
    phone: "+8801700000002",
    role: ROLE.admin,
    isEmailVerified: true,
  },

  {
    seedKey: USER_SEED_KEYS.PLAYER,
    name: "Alex Player",
    email: "player@football.com",
    phone: "+8801700000004",
    role: ROLE.player,
    isEmailVerified: true,
  },
  {
    seedKey: USER_SEED_KEYS.COACH,
    name: "Chris Coach",
    email: "coach@football.com",
    phone: "+8801700000005",
    role: ROLE.coach,
    isEmailVerified: true,
  },
  {
    seedKey: USER_SEED_KEYS.AGENT,
    name: "Adam Agent",
    email: "agent@football.com",
    phone: "+8801700000006",
    role: ROLE.agents,
    isEmailVerified: true,
  },
  {
    seedKey: USER_SEED_KEYS.CLUB,
    name: "City Club Manager",
    email: "club@football.com",
    phone: "+8801700000007",
    role: ROLE.club,
    isEmailVerified: true,
  },
];
