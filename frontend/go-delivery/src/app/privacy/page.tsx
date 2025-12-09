'use client'

import { useRouter } from 'next/navigation';
import DriverLayout from '@/components/layout/DriverLayout';
import { IoArrowBack } from 'react-icons/io5';

export default function PrivacyPolicyPage() {
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
                <h1 className="text-xl font-bold">Нууцлалын бодлого</h1>
            </div>

            <div className="bg-white rounded-2xl p-6">
                <p className="text-sm text-gray-500 mb-4">Сүүлд шинэчилсэн: 2025 оны 1-р сарын 1</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="font-bold text-lg mb-2">1. Танилцуулга</h2>
                        <p className="text-sm leading-relaxed">
                            Go Delivery ("бид", "манай") нь таны нууцлалыг хамгаалахад онцгой анхаарал хандуулдаг. 
                            Энэхүү нууцлалын бодлого нь таны хувийн мэдээллийг хэрхэн цуглуулж, 
                            ашиглаж, хамгаалж байгааг тайлбарлана.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">2. Цуглуулдаг мэдээлэл</h2>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Нэр, утасны дугаар, и-мэйл хаяг</li>
                            <li>Байршлын мэдээлэл (хүргэлтийн үед)</li>
                            <li>Тээврийн хэрэгслийн мэдээлэл</li>
                            <li>Дансны мэдээлэл (орлого шилжүүлэхэд)</li>
                            <li>Хүргэлтийн түүх болон гүйцэтгэлийн статистик</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">3. Мэдээллийн ашиглалт</h2>
                        <p className="text-sm leading-relaxed mb-2">
                            Бид таны мэдээллийг дараах зорилгоор ашиглана:
                        </p>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Хүргэлтийн үйлчилгээ үзүүлэх</li>
                            <li>Орлого тооцоолж шилжүүлэх</li>
                            <li>Таныг таних болон баталгаажуулах</li>
                            <li>Үйлчилгээг сайжруулах</li>
                            <li>Хууль ёсны шаардлага хангах</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">4. Мэдээллийн хамгаалалт</h2>
                        <p className="text-sm leading-relaxed">
                            Бид таны мэдээллийг аюулгүй байлгахын тулд техникийн болон 
                            зохион байгуулалтын арга хэмжээг авдаг. Үүнд шифрлэлт, 
                            хандалтын хяналт, аюулгүй серверүүд багтана.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">5. Мэдээлэл хуваалцах</h2>
                        <p className="text-sm leading-relaxed">
                            Бид таны мэдээллийг гуравдагч этгээдтэй зөвхөн дараах тохиолдолд хуваалцана:
                        </p>
                        <ul className="text-sm space-y-2 list-disc list-inside mt-2">
                            <li>Таны зөвшөөрөлтэйгээр</li>
                            <li>Хүргэлт хийхэд шаардлагатай үед (ресторан, хэрэглэгч)</li>
                            <li>Хууль ёсны шаардлагаар</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">6. Таны эрхүүд</h2>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            <li>Мэдээллээ үзэх, засах эрх</li>
                            <li>Мэдээллээ устгуулах хүсэлт гаргах эрх</li>
                            <li>Байршлын мэдээлэл хуваалцахаас татгалзах эрх</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-lg mb-2">7. Холбоо барих</h2>
                        <p className="text-sm leading-relaxed">
                            Асуулт байвал бидэнтэй холбогдоно уу:<br/>
                            И-мэйл: privacy@godelivery.mn<br/>
                            Утас: 7000-0000
                        </p>
                    </section>
                </div>
            </div>
        </DriverLayout>
    );
}
