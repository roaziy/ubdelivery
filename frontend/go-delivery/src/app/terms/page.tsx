'use client'

import { useRouter } from 'next/navigation';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoArrowBack } from 'react-icons/io5';

export default function TermsPage() {
    const router = useRouter();

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
                <h1 className="text-xl font-bold">Үйлчилгээний нөхцөл</h1>
            </div>

            <div className="bg-white rounded-2xl p-6">
                <p className="text-sm text-gray-500 mb-4">Хүчинтэй: 2025 оны 1-р сарын 1</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="font-bold text-lg mb-2">1. Ерөнхий нөхцөл</h2>
                        <p className="text-sm leading-relaxed">
                            Go Delivery платформд жолоочоор бүртгүүлснээр та эдгээр үйлчилгээний нөхцөлийг 
                            хүлээн зөвшөөрч байна. Хэрэв та зөвшөөрөхгүй бол платформыг ашиглах боломжгүй.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">2. Жолоочийн үүрэг</h2>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Хүчинтэй жолооны үнэмлэхтэй байх</li>
                            <li>Тээврийн хэрэгслийн бүртгэл хүчинтэй байх</li>
                            <li>Хүргэлтийг цаг тухайд нь гүйцэтгэх</li>
                            <li>Хоолыг аюулгүй, бүрэн бүтэн хүргэх</li>
                            <li>Хэрэглэгчтэй эелдэг харилцах</li>
                            <li>Замын хөдөлгөөний дүрмийг мөрдөх</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">3. Орлого ба төлбөр</h2>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Хүргэлт бүрийн орлого системд бүртгэгдэнэ</li>
                            <li>Орлого 7 хоног бүр шилжүүлэгдэнэ</li>
                            <li>Платформын шимтгэл 15% байна</li>
                            <li>Урамшууллын хөтөлбөрт хамрагдах боломжтой</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">4. Захиалга хүлээн авах</h2>
                        <p className="text-sm leading-relaxed">
                            Та захиалга хүлээн авах эсэхээ шийдэх эрхтэй. Гэхдээ хүлээн авсан захиалгыг 
                            үндэслэлгүйгээр цуцлах нь таны үнэлгээнд сөргөөр нөлөөлнө.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">5. Үнэлгээний систем</h2>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Хэрэглэгчид хүргэлт бүрийн дараа үнэлгээ өгөх боломжтой</li>
                            <li>Дундаж үнэлгээ 4.0-оос доош бол анхааруулга авна</li>
                            <li>Үнэлгээ 3.5-аас доош бол бүртгэл түдгэлзүүлэгдэж болно</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">6. Хориглох зүйлс</h2>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Хуурамч мэдээлэл оруулах</li>
                            <li>Хэрэглэгчийн мэдээллийг хувийн зорилгоор ашиглах</li>
                            <li>Согтууруулах ундаа, мансууруулах бодис хэрэглэсэн үед жолоодох</li>
                            <li>Системийг хууран мэхлэх оролдлого хийх</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">7. Гэрээ цуцлах</h2>
                        <p className="text-sm leading-relaxed">
                            Та хүссэн үедээ жолоочийн бүртгэлээ цуцлах боломжтой. 
                            Бид мөн дүрэм зөрчсөн тохиолдолд бүртгэлийг түр түдгэлзүүлэх 
                            эсвэл бүрмөсөн цуцлах эрхтэй.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">8. Хариуцлага</h2>
                        <p className="text-sm leading-relaxed">
                            Go Delivery нь хүргэлтийн явцад гарсан осол, гэмтлийн хариуцлага хүлээхгүй. 
                            Жолооч өөрийн даатгалтай байхыг зөвлөж байна.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">9. Нөхцөл өөрчлөлт</h2>
                        <p className="text-sm leading-relaxed">
                            Бид үйлчилгээний нөхцлийг хэдийд ч өөрчлөх эрхтэй. 
                            Өөрчлөлт орсон тохиолдолд танд мэдэгдэл илгээнэ.
                        </p>
                    </section>
                </div>
            </div>
        </DriverLayout>
    );
}
