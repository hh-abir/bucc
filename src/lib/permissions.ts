export type UserRole = {
  designation: string;
  buccDepartment: string;
  memberStatus?: string;
};

export const isGoverningBody = (user: UserRole) => {
  if (user.memberStatus === "Alumni") return false;
  const gbDesignations = ["President", "Vice President", "General Secretary", "Treasurer"];
  return gbDesignations.includes(user.designation);
};

export const isRDAdmin = (user: UserRole) => {
  if (user.memberStatus === "Alumni") return false;
  return (
    user.buccDepartment === "Research and Development" &&
    ["Director", "Assistant Director"].includes(user.designation)
  );
};

export const isHRAdmin = (user: UserRole) => {
  if (user.memberStatus === "Alumni") return false;
  return (
    user.buccDepartment === "Human Resources" &&
    ["Director", "Assistant Director"].includes(user.designation)
  );
};

export const canManageInquiries = (user: UserRole) => {
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const canManageProjects = (user: UserRole) => {
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const isSuperUser = (user: UserRole) => {
  return isGoverningBody(user) || isRDAdmin(user);
};

export const canManageMembers = (user: UserRole) => {
  if (user.memberStatus === "Alumni") return false;
  if (isGoverningBody(user)) return true;
  
  return (
    ["Director", "Assistant Director"].includes(user.designation)
  );
};

export const canManageEvents = (user: UserRole) => {
  if (user.memberStatus === "Alumni") return false;
  if (isSuperUser(user)) return true;
  
  return (
    user.buccDepartment === "Event Management" &&
    ["Director", "Assistant Director"].includes(user.designation)
  );
};

export const canManageBlogs = (user: UserRole) => {
  if (user.memberStatus === "Alumni") return false;
  return isGoverningBody(user) || ["Director", "Assistant Director"].includes(user.designation);
};
