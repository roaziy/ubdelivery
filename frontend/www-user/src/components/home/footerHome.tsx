import Image from "next/image"; 

//icons 
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";


export default function FooterHome() {
    return (
        <footer className="relative bg-mainBlack pt-24 pb-16 text-white overflow-hidden mt-auto md:block hidden">
            <div className="absolute top-0 left-0 w-full h-10 bg-backgroundGreen rounded-b-full z-12" />
            <div className="container max-w-[1250px] mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                <div className="flex flex-col gap-[40px] items-center md:items-start">
                    <Image
                        src="/logos/logoSmall.svg"
                        alt="UB Delivery Logo"
                        width={100}
                        height={100}
                        className="w-[50px] h-[50px] select-none"
                        draggable={false}
                    />
                    <div className="flex gap-5 text-[#919191] select-none">
                        <a href="https://www.facebook.com/erkhemtur" target="_blank" rel="noopener noreferrer" aria-label="Facebook" draggable={false}>
                            <FaFacebook size={20} />
                        </a>
                        <a href="https://twitter.com/roaziy" target="_blank" rel="noopener noreferrer" aria-label="Twitter" draggable={false}>
                            <FaXTwitter size={20} />
                        </a>
                        <a href="https://www.instagram.com/roaziy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" draggable={false}>
                            <FaInstagram size={20} />
                        </a>
                    </div>                    
                </div>
                <div className="flex flex-col items-center md:items-end">
                    <div className="flex flex-col md:flex-row gap-10 md:gap-[51px] text-center md:text-left mt-8 md:mt-0">
                        <a href="/policy" className="text-white text-[14px] md:text-[16px] hover:text-gray-300 transition-colors select-none" target="_blank" rel="noopener noreferrer" draggable={false}>Нууцлалын бодлого</a>
                        <a href="/terms" className="text-white text-[14px] md:text-[16px] hover:text-gray-300 transition-colors select-none" target="_blank" rel="noopener noreferrer" draggable={false}>Үйлчилгээний нөхцөл</a>
                    </div>
                    <p className="text-white text-[12px] md:text-[14px] font-normal select-none text-center md:text-right mt-12 md:mt-[50px]">Made with ❤️ by <a href="https://www.instagram.com/roaziy" target="_blank" rel="noopener noreferrer">roaziy</a> © 2025</p>
                </div>
            </div>
        </footer>
    );
}