import { Role } from "../role/index";
import { User } from "../user/index";

export class Profile {
    id?: string;
    user?: User;
    name?: string;
    email?: string;
    mobile?: string;
    role?: Role;
    profilePic?: string;
    isEmailVerified?: boolean; // Vital for security and account recovery
    lastLogin?: Date; // Important for security auditing and user engagement tracking
}