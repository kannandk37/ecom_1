import { roleResponseDatumToRoleEntity } from "../../role/transformer/index";
import { userResponseDatumToUserEntity } from "../../user/transformer/index";
import { Profile } from "../../../entity/profile/index";

export function profileResponseDatumToProfileEntity(raw: any): Profile {
    let profile = new Profile();

    if (raw === null) {
        return profile = null;
    }

    if (raw.id) {
        profile.id = raw.id;
    }

    if (raw.user) {
        profile.user = userResponseDatumToUserEntity(raw.user);
    }

    if (raw.name) {
        profile.name = raw.name;
    }

    if (raw.email) {
        profile.email = raw.email;
    }

    if (raw.mobile) {
        profile.mobile = raw.mobile;
    }

    if (raw.role) {
        profile.role = roleResponseDatumToRoleEntity(raw.role);
    }

    if (raw.profilePic) {
        profile.profilePic = raw.profilePic;
    }

    if (raw.isEmailVerified !== undefined) {
        profile.isEmailVerified = raw.isEmailVerified;
    }

    if (raw.lastLogin) {
        profile.lastLogin = new Date(raw.lastLogin);
    }

    return profile;
}

export function profilesResponseDataToProfilesEntities(raws: any[]): Profile[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map((raw) => profileResponseDatumToProfileEntity(raw));
}