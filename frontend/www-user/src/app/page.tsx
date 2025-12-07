import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";

import Header from "../components/LandingPage/header/header";
import Footer from "../components/LandingPage/footer/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <section className="h-screen flex flex-col md:flex-row items-center justify-between max-w-[1250px] mx-auto">
        <div className="max-w-lg px-6 md:px-0">
            <h1 className="text-[30px] md:text-[40px] mt-24 md:mt-0  font-bold mb-6 leading-[115%] md:pl-10">
            Монголын <span className="text-mainGreen" >хамгийн хурдан</span> хоол хүргэлтийн платформ
            </h1>
          <p className="text-sm md:text-lg mb-8 md:pl-10 md:mt-16">
            Хүргэлтийн үйлчилгээг шинэ түвшинд аваачихад бидэнтэй нэгдээрэй.
          </p>
          <div className="md:pl-10 mt-6">
            <div className="flex items-center bg-white border-1 border-gray-300 rounded-full py-[2px] overflow-hidden max-w-md">
              <div className="flex items-center pl-4 pr-2">
                <IoLocationSharp className="text-[#848484]" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Хүргэлт хийх хаяг" 
                className="flex-1 py-3 px-2 outline-none text-sm"
              />
              <button className="bg-mainGreen text-white px-6 py-2 mr-2 rounded-full hover:bg-green-600 transition-colors font-medium text-sm">
                Хайх
              </button>
            </div>
          </div>
        </div>
        <div className="flex h-full items-center justify-center relative ">
          <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-[#4bff45] rounded-full blur-3xl opacity-10 ml-10 md:ml-20"></div>
          <Image
            src="/LandingPage/iphone.png"
            alt="iPhone screenshot"
            width={1028}
            height={1582}
            className="md:pt-10 pl-9 w-[450px] md:min-w-[400px] md:w-[600px] h-auto select-none z-10"
            draggable={false}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
