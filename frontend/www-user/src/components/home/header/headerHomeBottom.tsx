'use client';

import { FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";


export default function HeaderHomeBottom() {

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg shadow-gray-200/50 z-25">
            <div className="container max-w-[370px] mx-auto px-4 py-5 flex justify-between items-center select-none md:hidden text-[#D9D9D9]">
                <FaHome size={24} />
                <FaCartShopping size={22} />
                <MdAccountCircle size={25} />
            </div>
        </div>
    )
}