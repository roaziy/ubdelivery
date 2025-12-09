'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoArrowBack, IoChevronDown, IoChevronUp, IoCall, IoMail, IoChatbubbles } from 'react-icons/io5';

const faqs = [
    {
        question: 'Хэрхэн орлогоо авах вэ?',
        answer: 'Орлого долоо хоног бүрийн Даваа гарагт таны бүртгэсэн банкны данс руу автоматаар шилжүүлэгдэнэ. Та мөн "Орлого" хэсгээс шилжүүлэг хүсэх боломжтой.'
    },
    {
        question: 'Захиалга хүлээж авахгүй бол яах вэ?',
        answer: 'Захиалга ирэхгүй байвал дараах зүйлсийг шалгана уу: 1) Интернэт холболт, 2) Байршлын тохиргоо идэвхтэй эсэх, 3) Аппликейшн шинэчилсэн эсэх. Асуудал шийдэгдэхгүй бол тусламж хэсгээр холбогдоно уу.'
    },
    {
        question: 'Үнэлгээ хэрхэн нэмэгдэх вэ?',
        answer: 'Хэрэглэгчид хүргэлт бүрийн дараа танд үнэлгээ өгөх боломжтой. Цаг баримталж, эелдэг үйлчилснээр үнэлгээгээ дээшлүүлэх боломжтой.'
    },
    {
        question: 'Захиалга цуцлах боломжтой юу?',
        answer: 'Тийм, гэхдээ захиалга хүлээн авсны дараа цуцлах нь таны үнэлгээнд сөргөөр нөлөөлнө. Зөвхөн хүндэтгэх шалтгаантай үед цуцлахыг зөвлөж байна.'
    },
    {
        question: 'Тээврийн хэрэгслээ солих бол яах вэ?',
        answer: '"Профайл" хэсэгт орж тээврийн хэрэгслийн мэдээллээ шинэчлэх боломжтой. Бүртгэлийн дугаар өөрчлөгдсөн бол баримт бичгээ дахин оруулах шаардлагатай.'
    },
    {
        question: 'Урамшуулал хэрхэн авах вэ?',
        answer: 'Урамшууллын хөтөлбөр тогтмол зарлагддаг. Мэдэгдэл хэсгээс урамшууллын мэдээллийг хүлээн авч болно. Идэвхтэй жолоочид илүү их урамшуулал авах боломжтой.'
    },
];

export default function HelpPage() {
    const router = useRouter();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <DriverLayout hideNav>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button 
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                >
                    <IoArrowBack size={20} />
                </button>
                <h1 className="text-xl font-bold">Тусламж</h1>
            </div>

            {/* Contact Options */}
            <div className="bg-white rounded-2xl p-4 mb-4">
                <h3 className="font-semibold mb-3">Холбоо барих</h3>
                <div className="grid grid-cols-3 gap-2">
                    <a 
                        href="tel:70000000"
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                        <IoCall className="text-mainGreen" size={24} />
                        <span className="text-xs text-center">Залгах</span>
                    </a>
                    <a 
                        href="mailto:support@godelivery.mn"
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                        <IoMail className="text-mainGreen" size={24} />
                        <span className="text-xs text-center">И-мэйл</span>
                    </a>
                    <button 
                        onClick={() => window.open('https://m.me/godelivery', '_blank')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                        <IoChatbubbles className="text-mainGreen" size={24} />
                        <span className="text-xs text-center">Чат</span>
                    </button>
                </div>
            </div>

            {/* Support Hours */}
            <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-mainGreen">
                    🕐 Тусламжийн үйлчилгээ: Өдөр бүр 08:00 - 22:00
                </p>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl overflow-hidden">
                <h3 className="font-semibold p-4 border-b border-gray-100">Түгээмэл асуултууд</h3>
                
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0">
                        <button
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                        >
                            <span className="font-medium text-sm pr-4">{faq.question}</span>
                            {expandedIndex === index ? (
                                <IoChevronUp className="text-gray-400 flex-shrink-0" size={18} />
                            ) : (
                                <IoChevronDown className="text-gray-400 flex-shrink-0" size={18} />
                            )}
                        </button>
                        
                        {expandedIndex === index && (
                            <div className="px-4 pb-4">
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Emergency */}
            <div className="mt-4 p-4 bg-red-50 rounded-xl">
                <p className="text-sm text-red-700">
                    🚨 Яаралтай тусламж (осол, гэмтэл): <strong>102</strong>
                </p>
            </div>
        </DriverLayout>
    );
}
