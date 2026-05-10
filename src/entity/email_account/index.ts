import { User } from "../user";

export class EmailAccount {
    id?: string;
    user?: User;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
};