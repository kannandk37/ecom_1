import { permissionsResponseDataToPermissionsEntities } from "../../permission/transformer/index";
import { Role, RoleName } from "../../../entity/role/index";

export function roleResponseDatumToRoleEntity(raw: any): Role {
    let role = new Role();

    if (raw === null) {
        return role = null;
    }

    if (raw.id) {
        role.id = raw.id;
    }

    if (raw.name) {
        role.name = raw.name as RoleName;
    }

    if (raw.permissions) {
        role.permissions = permissionsResponseDataToPermissionsEntities(raw.permissions);
    }

    if (raw.description) {
        role.description = raw.description;
    }

    if (raw.isSystemRole !== undefined) {
        role.isSystemRole = raw.isSystemRole;
    }

    return role;
}

export function rolesResponseDataToRolesEntities(raws: any[]): Role[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(roleResponseDatumToRoleEntity);
}