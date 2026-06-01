export enum Role {
  OWNER = 'OWNER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  DEPT_MANAGER = 'DEPT_MANAGER',
  MEMBER = 'MEMBER',
}

export enum OrganizationType {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

export enum ProcessingStatus {
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}
