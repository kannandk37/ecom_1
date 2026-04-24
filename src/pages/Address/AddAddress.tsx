import { useNavigate } from 'react-router-dom';
import DashBoardButton from '../../assets/ui/DashBoardButton/DashBoardButton';
import DashBoardInput from '../../assets/ui/DashBoardInput/DashBoardInput';
import './AddAddress.css'
import React, { useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import Dropdown from '../../assets/dropdown/DropDown';

enum AddressType {
    HOME = 'Home',
    OFFICE = 'Office',
    OTHERS = 'Others'
}

interface Address {
    line1?: string;
    line2?: string;
    type?: AddressType;
    city?: string;
    state?: string;
    mobile?: string;
}

interface AddAddressInterface {
    onClickBack?: () => void;
    onSubmit?: () => void;
}

const sortOptions: { id: number; value: string }[] = [
  { id: 1, value: "Karaikal" },
  { id: 2, value: "Mahe" },
  { id: 3, value: "Puducherry" },
  { id: 4, value: "Yanam" },
];

const AddAddress = ({onClickBack, onSubmit}: AddAddressInterface) => {
    const [addressType, setAddressType] = useState<AddressType>(AddressType.HOME);
    const [address, setAddress] = useState<Address>({});
    const navigate = useNavigate();

    return (
        <div className="add-address-address-container">
            <div className="add-address-address-card">
                <div className="add-address-address-header">
                    <h2 className="add-address-address-title">Add New Address</h2>
                    <DashBoardButton
                        variant='secondary'
                        onClick={() => onClickBack?.()}
                        name='Back to Saved'
                        icon={<IoArrowBackOutline />}
                        width={'150px'}
                    />
                </div>

                <form className="add-address-address-form">
                    {/* Address Type Selection */}
                    <div className="add-address-form-section">
                        <label className="add-address-input-label">ADDRESS TYPE</label>
                        <div className="add-address-radio-group">
                            {[AddressType.HOME, AddressType.OFFICE, AddressType.OTHERS].map((type) => (
                                <div
                                    key={type}
                                    className={`add-address-radio-item ${addressType === type ? 'active' : ''}`}
                                    onClick={() => { setAddressType(type); address.type = type; setAddress(address) }}
                                >
                                    <input
                                        type="radio"
                                        checked={addressType === type}
                                        readOnly
                                    />
                                    <span>{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address Lines */}
                    <div className="add-address-input-row">
                        <DashBoardInput
                            value={address.line1 || ''}
                            onChange={() => { }}
                            label="Address Line 1"
                            placeholder="Flat, House no., Building, Company, Apart"
                        />
                    </div>

                    <div className="add-address-input-row">
                        <DashBoardInput
                            value={address.line2 || ''}
                            onChange={() => { }}
                            label="Address Line 2"
                            placeholder="Area, Street, Sector, Village"
                        />
                    </div>

                    {/* City and State */}
                    <div className="add-address-grid-row">
                        <div className="add-address-input-row">
                            <DashBoardInput
                                value={address.city || ''}
                                onChange={() => { }}
                                label="City"
                                placeholder="Town/City"
                            />
                        </div>
                        <div className="add-address-input-row">
                            <Dropdown label="State" options={sortOptions} onSelect={(el) => {address.state = el.value; setAddress(address)}} />
                            <label className="add-address-input-label">State</label>
                            <select className="add-address-custom-select error-border">
                                <option onSelect={(el) => console.log(el)}>Select State</option>
                            </select>
                            <span className="add-address-error-text">This field is required</span>
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="add-address-input-row">
                            <DashBoardInput
                                label='Mobile Number'
                                value={address.mobile || ''}
                                onChange={() => { }}
                                placeholder='Mobile Number'
                            />
                    </div>

                    {/* Action Button */}
                    <div className="add-address-form-footer">
                        <DashBoardButton
                            variant='primary'
                            onClick={() => { console.log('asdas'); onSubmit; }}
                            name='Add Address'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddress;
