// An application depends on what roles it will have.

export const ROLE = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  player: 'player',
  coach: 'coach',
  agents: 'agents',
  club: 'club',
  common: 'common',
  commonAdmin: 'commonAdmin',
} as const;

const {  admin, superAdmin, common, commonAdmin, player, coach, agents, club } = ROLE;

export const AllRoles = {
  [superAdmin]: [common, commonAdmin, superAdmin],
  [admin]: [common, commonAdmin, admin],
  [player]: [common, player],
  [coach]: [common, coach],
  [agents]: [common, agents],
  [club]: [common, club],
} as const;


export type TRoles = keyof typeof AllRoles;

export type Permission = (typeof ROLE)[keyof typeof ROLE];

type RolePermissions = readonly Permission[];

export const AllowSignupRoles = [ player, coach, agents, club] as const satisfies readonly TRoles[];

const roleRights = new Map<TRoles, RolePermissions>(
  Object.entries(AllRoles) as [TRoles, RolePermissions][]
);

export default {
  roles: AllRoles,
  roleRights,
};
