import { Address, AddressType } from "../../../entity/address";
import { userResponseDatumToUserEntity } from "../../user/transformer";

export function addressResponseDatumToAddressEntity(response: any): Address {
    let address = new Address();
    if (response === null) {
        return address = null;
    }

    if (response.id) {
        address.id = response.id;
    }

    if (response.user) {
        address.user = userResponseDatumToUserEntity(response.user);
    }

    if (response.line1) {
        address.line1 = response.line1;
    }

    if (response.line2) {
        address.line2 = response.line2;
    }

    if (response.city) {
        address.city = response.city;
    }

    if (response.state) {
        address.state = response.state;
    }

    if (response.pincode) {
        address.pincode = response.pincode;
    }

    if (response.country) {
        address.country = response.country;
    }

    if (response.mobile) {
        address.mobile = response.mobile;
    }

    if (response.type) {
        address.type = response.type as AddressType;
    }

    return address;
}

export function addressesResponseDataToAddressesEntities(responses: any[]): Address[] {
    if (!responses || responses.length === 0) {
        return [];
    }
    return responses.map(addressResponseDatumToAddressEntity);
}