'use client'

import { IoLocationOutline } from "react-icons/io5";

interface CheckoutFormData {
    address: string;
    floor: string;
    doorNumber: string;
    doorCode: string;
    detailedAddress: string;
    paymentMethod: string;
    couponCode: string;
}

interface CheckoutFormProps {
    formData: CheckoutFormData;
    onFormChange: (field: keyof CheckoutFormData, value: string) => void;
    onSubmit: () => void;
}

export default function CheckoutForm({ formData, onFormChange, onSubmit }: CheckoutFormProps) {
    return (
        <div className="space-y-8">
            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-center mb-2">Таны хаяг</label>
                <div className="relative">
                    <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        value={formData.address}
                        onChange={(e) => onFormChange('address', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[13px] text-sm outline-none focus:border-mainGreen"
                        placeholder="Хүргэлт хийх хаяг"
                    />
                </div>
            </div>

            {/* Floor and Door Number */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-center mb-2">Давхар</label>
                    <input 
                        type="text"
                        value={formData.floor}
                        onChange={(e) => onFormChange('floor', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                        placeholder="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-center mb-2">Тоот</label>
                    <input 
                        type="text"
                        value={formData.doorNumber}
                        onChange={(e) => onFormChange('doorNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                        placeholder="1"
                    />
                </div>
            </div>

            {/* Door Code */}
            <div>
                <label className="block text-sm font-medium text-center mb-2">Орцны код</label>
                <input 
                    type="text"
                    value={formData.doorCode}
                    onChange={(e) => onFormChange('doorCode', e.target.value)}
                    placeholder="123456#abc"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                />
            </div>

            {/* Detailed Address */}
            <div>
                <label className="block text-sm font-medium text-center mb-2">Дэлгэрэнгүй хаяг</label>
                <input 
                    type="text"
                    value={formData.detailedAddress}
                    onChange={(e) => onFormChange('detailedAddress', e.target.value)}
                    placeholder="Дэлгэрэнгүй хаяг"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                />
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium text-center mb-2">Төлбөрийн баримт авах:</label>
                <select 
                    value={formData.paymentMethod}
                    onChange={(e) => onFormChange('paymentMethod', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen appearance-none bg-white"
                >
                    <option value="">E-Barimt сонгох</option>
                    <option value="main">14001507</option>
                </select>
            </div>

            {/* Coupon Code */}
            <div>
                <label className="block text-sm font-medium text-center mb-2">Купон код ашиглах</label>
                <input 
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => onFormChange('couponCode', e.target.value)}
                    placeholder="Купон, бэлгийн картын дугаар"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[13px] text-sm text-center outline-none focus:border-mainGreen"
                />
            </div>

            {/* Payment Button */}
            <button 
                onClick={onSubmit}
                className="w-full mt-4 bg-mainGreen text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
                Төлбөр төлөх
            </button>
        </div>
    );
}
