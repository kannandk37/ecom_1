import { rolesResponseDataToRolesEntities } from "../../role/transformer/index";
import { User } from "../../../entity/user/index";

export function userResponseDatumToUserEntity(raw: any): User {
    let user = new User();

    if (raw === null) {
        return user = null;
    }

    if (raw.id) {
        user.id = raw.id;
    }

    if (raw.roles && raw.roles.length > 0) {
        user.roles = rolesResponseDataToRolesEntities(raw.roles);
    }

    return user;

}

export function usersResponseDataToUsersEntities(raws: any[]): User[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(userResponseDatumToUserEntity);
}