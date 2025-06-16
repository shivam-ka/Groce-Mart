import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from 'react';
import { ButtonLoading } from "../components/index"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../Utils/Axios";
import summarApi from "../common/SummaryApi";
import { errorToast, infoToast, warningToast } from "../Utils/ShowToast";


// Icons 
import { FiEdit, FiTrash2, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaPlus, FaTimes, FaCheck, FaUpload, FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDots, } from "react-icons/bs";



const AddressManagement = () => {

    const { fetchAddress } = useGlobalContext();

    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const addressList = useSelector(state => state.addresses.addressList)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState('');
    const dropdownRef = useRef(null);

    const [selectedAddress, setSelectedAddress] = useState(false)
    const [errors, setErrors] = useState({
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        mobile: ''
    });
    const [newAddress, setNewAddress] = useState({
        addressId: "",
        address_line: '',
        city: '',
        pincode: '',
        state: '',
        mobile: '',
    });


    const validateNewAddress = () => {
        const errors = {};
        let isValid = true;


        if (!newAddress.address_line?.trim()) {
            errors.address_line = "Street address is required";
            isValid = false;
        } else if (newAddress.address_line.trim().length < 5) {
            errors.address_line = "Address must be at least 5 characters";
            isValid = false;
        }


        if (!newAddress.city?.trim()) {
            errors.city = "City is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(newAddress.city.trim())) {
            errors.city = "City can only contain letters";
            isValid = false;
        }


        if (!newAddress.state?.trim()) {
            errors.state = "State is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(newAddress.state.trim())) {
            errors.state = "State can only contain letters";
            isValid = false;
        }


        if (!newAddress.pincode?.trim()) {
            errors.pincode = "Postal code is required";
            isValid = false;
        } else if (!/^\d{6}$/.test(newAddress.pincode.trim())) {
            errors.pincode = "Postal code must be 6 digits";
            isValid = false;
        }


        if (!newAddress.mobile?.trim()) {
            errors.mobile = "Phone number is required";
            isValid = false;
        } else if (!/^[0-9]{10}$/.test(newAddress.mobile.trim())) {
            errors.mobile = "Phone number must be 10 digits";
            isValid = false;
        }

        return { isValid, errors };
    };

    const handleAddAddress = async () => {
        if (addressList.lenght >= 3) {
            warningToast('You Can Only Add Three Addresses')
        }

        const { isValid, errors } = validateNewAddress();

        if (!isValid) {
            setErrors(errors);
            return;
        }

        setIsLoading(true)

        try {
            const response = await Axios({
                ...summarApi.address.addAddress,
                data: newAddress
            })

            if (response.data.success) {
                fetchAddress()
                setIsModalOpen(false)
                handleResetform()
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    };

    const handleUpdateAddress = async () => {
        validateNewAddress()
        const { isValid, errors } = validateNewAddress();

        if (!isValid) {
            setErrors(errors);
            return;
        }


        try {
            const response = await Axios({
                ...summarApi.address.updateAddress,
                data: newAddress
            })

            if (response.data.success) {
                fetchAddress()
                setIsModalOpen(false)
                handleResetform()
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    };

    const handleDeleteAddress = async (id) => {
        const deleteResponse = confirm('Do You Want to Delete This Address')
        if (!deleteResponse) {
            return;
        }

        setIsLoading(true)

        try {
            const response = await Axios({
                url: `${summarApi.address.deleteAddress.url}/${id}`,
                method: summarApi.address.deleteAddress.method
            })


            if (response.data.success) {
                fetchAddress()
                setIsModalOpen(false)
                handleResetform()
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetform = () => {
        setNewAddress({
            addressId: "",
            address_line: '',
            city: '',
            pincode: '',
            state: '',
            mobile: '',
        })
        setIsModalOpen(false)
        setIsEditMode(false)
    }

    const handleEdit = (address) => {
        setIsEditMode(true)
        setNewAddress({
            addressId: address._id,
            address_line: address.address_line,
            city: address.city,
            state: address.city,
            pincode: address.pincode,
            mobile: address.mobile
        })
        setIsModalOpen(true)
    }

    useEffect(() => {
        if (isModalOpen) {
            document.querySelector('body').style.overflowY = 'hidden'
        } else {
            document.querySelector('body').style.overflowY = 'scroll'
        }
    }, [isModalOpen])



    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <motion.div
                className="w-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >

                <div className="bg-white rounded-xl shadow-sm px-2 py-4 md:p-6 sticky top-8">

                    <div className="flex items-center justify-between  bg-white ">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-600" />
                            <span>Addresses</span>
                        </h2>

                        <button
                            onClick={() => {
                                if (addressList.length >= 3) {
                                    return infoToast('You Can Only Add Three Addresses')
                                }
                                setIsModalOpen(true)
                            }}
                            className="cursor-pointer flex items-center text-sm md:text-base gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 "
                        >
                            <FaPlus className="text-xs md:text-sm" />
                            <span>Add New</span>
                        </button>
                    </div>

                    <div className="max-w-2xl mx-auto pt-4 space-y-4">
                        {addressList.map((add) => (
                            <motion.div
                                key={add._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setSelectedAddress(add._id)}
                                className={`relative px-4 py-2 md:p-6 rounded-lg md:rounded-xl transition-all duration-200 cursor-pointer
                                         ${selectedAddress === add._id
                                        ? 'bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-1 border-purple-600 shadow-lg shadow-purple-100/50'
                                        : 'bg-white border  border-gray-400 hover:border-gray-800'
                                    }`}
                            >

                                <div className="absolute top-2 right-2">
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setIsOpen(add._id)}
                                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="More options"
                                        >
                                            <BsThreeDots className="cursor-pointer w-5 h-5" />
                                        </button>

                                        {isOpen === add._id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                            >
                                                <div className="p-1">
                                                    <button
                                                        onClick={() => { handleEdit(add) }}
                                                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <FiEdit className="mr-3 text-gray-500" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => { handleDeleteAddress(add._id) }}
                                                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <FiTrash2 className="mr-3 text-red-500" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    {/* Address content */}
                                    <div className="flex-1 space-y-0.5 md:space-y-1">
                                        <div className="flex items-center gap-1">

                                            <h3 className="text-base md:text-lg font-semibold text-gray-900">{user.name}</h3>

                                        </div>

                                        <p className="text-sm md:text-base text-gray-900 font-medium">{add.address_line}</p>

                                        <div className="flex items-center gap-2 text-gray-900 text-sm md:text-base">

                                            <span>{add.city}, {add.state} - {add.pincode}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-900 text-sm md:text-base">

                                            <span>+91 {add.mobile}</span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </motion.div>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => handleResetform()}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white border rounded-xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {isEditMode ? 'Edit Address' : 'Add New Address'}
                                </h2>
                                <button
                                    onClick={() => handleResetform()}
                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4 h-[70vh] overflow-y-scroll scrollbar-hide">
                                {/* Address Line */}
                                <div>
                                    <label htmlFor="address_line" className="block text-sm font-medium text-gray-700 mb-1">
                                        House No And Street Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address_line"
                                        name="address_line"
                                        placeholder="House number and street name"
                                        value={newAddress.address_line}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                    {errors.address_line && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address_line}</p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="Enter your city"
                                        value={newAddress.city}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                    )}
                                </div>

                                {/* State */}
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                        State/Province <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        placeholder="Enter your state or province"
                                        value={newAddress.state}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                    {errors.state && (
                                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                                    )}
                                </div>

                                {/* Pincode */}
                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP/Postal Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="pincode"
                                        name="pincode"
                                        placeholder="Enter postal code"
                                        value={newAddress.pincode}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                    {errors.pincode && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                                    )}
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="Enter mobile number with country code"
                                        value={newAddress.mobile}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                    {errors.mobile && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                                    )}
                                </div>

                                <div className="pt-2 text-xs text-gray-500">
                                    <p>Fields marked with <span className="text-red-500">*</span> are required</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => handleResetform()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>

                                {!isEditMode ? (
                                    <button
                                        onClick={() => handleAddAddress()}
                                        disabled={isLoading}
                                        className='px-4 py-2 rounded-lg text-white font-medium flex items-center bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? (
                                            <>
                                                <ButtonLoading />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload className="mr-2" />
                                                Add Address
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleUpdateAddress}
                                        disabled={isLoading}
                                        className='px-4 py-2 rounded-lg text-white font-medium flex items-center bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? (
                                            <>
                                                <ButtonLoading />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="mr-2" />
                                                Update Address
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AddressManagement
