'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import SettingsTabs from "./SettingsTabs";
import ProfileForm from "./ProfileForm";
import OrderHistorySection from "../orders/OrderHistorySection";

export default function SettingsSection() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'terms'>('settings');

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('phoneNumber');
        router.push('/');
    };

    const handleDeleteAccount = () => {
        // Show confirmation dialog
        if (confirm('Та бүртгэлээ устгахдаа итгэлтэй байна уу?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('phoneNumber');
            router.push('/');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'settings':
                return (
                    <ProfileForm 
                        onLogout={handleLogout}
                        onDeleteAccount={handleDeleteAccount}
                    />
                );
            case 'history':
                return <SettingsHistoryContent />;
            case 'terms':
                return <TermsContent />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:mt-8 mb-20 md:mb-8 min-h-[550px]">
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderContent()}
        </div>
    );
}

// History content component (simplified version for settings page)
function SettingsHistoryContent() {
    const router = useRouter();
    
    return (
        <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Захиалгын түүхийг харах</p>
            <button
                onClick={() => router.push('/home/orders')}
                className="px-6 py-3 bg-mainGreen text-white rounded-full font-medium hover:bg-green-600 transition-colors"
            >
                Түүх харах
            </button>
        </div>
    );
}

// Terms content component
function TermsContent() {
    return (
        <div className="max-w-none">
            <h2 className="text-xl font-bold text-center mb-6">Үйлчилгээний нөхцөл</h2>
            
            <div className="space-y-6 text-gray-700 text-sm">
                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">1. Ерөнхий үндэслэл</h3>
                    <p className="mb-2">
                        UB Delivery нь хоол хүргэх платформ бөгөөд хэрэглэгч, ресторан, хүргэлтийн ажилтнуудыг холбох үйлчилгээ юм. 
                        Манай платформыг ашигласнаар та эдгээр үйлчилгээний нөхцөлийг хүлээн зөвшөөрч байна.
                    </p>
                    <p>
                        Үйлчилгээний нөхцөл нь цаг хугацааны явцад өөрчлөгдөж болно. Таныг тогтмол шалгаж, шинэчлэлтийг мэдэх үүрэгтэй.
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">2. Хэрэглэгчийн бүртгэл</h3>
                    <p className="mb-2">
                        Платформыг ашиглахын тулд та үнэн зөв мэдээлэл өгч, бүртгүүлэх шаардлагатай. Та өөрийн бүртгэлийн 
                        мэдээллийг нууцлах үүрэгтэй бөгөөд бүртгэлтэй холбоотой бүх үйл ажиллагаанд хариуцлага хүлээнэ.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>18 нас хүрсэн байх шаардлагатай</li>
                        <li>Хүчинтэй цахим шуудангийн хаяг ба утасны дугаар өгөх</li>
                        <li>Нууц үгээ аюулгүй хадгалах</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">3. Захиалга болон төлбөр</h3>
                    <p className="mb-2">
                        Та захиалга өгснөөр тухайн бүтээгдэхүүн, үйлчилгээг худалдан авах гэрээ байгуулж байна. 
                        Бүх захиалга нь ресторанаас баталгаажих шаардлагатай.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Үнэ, хүргэлтийн төлбөр нь захиалгын үед тодорхой заагдана</li>
                        <li>Төлбөрийг картаар эсвэл бэлнээр хийж болно</li>
                        <li>Хүргэлтийн хураамж нь зайнаас хамаарна</li>
                        <li>Урамшуулал, хөнгөлөлт нь тодорхой нөхцөлтэй байж болно</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">4. Хүргэлт</h3>
                    <p className="mb-2">
                        Бид найдвартай, түргэн хүргэлтийг эрмэлздэг боловч хүргэлтийн хугацаа нь цаг агаар, 
                        замын нөхцөл, захиалгын тоо зэргээс хамаарч өөрчлөгдөж болно.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Хүргэлтийн хугацаа нь ойролцоогоор тооцоолсон</li>
                        <li>Хаягийн мэдээлэл үнэн зөв байх шаардлагатай</li>
                        <li>Хүргэгч таньд утсаар холбогдох боломжтой байх</li>
                        <li>Хүргэлт хийх боломжгүй тохиолдолд мэдэгдэх болно</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">5. Цуцлах болон буцаах</h3>
                    <p className="mb-2">
                        Захиалгыг тодорхой нөхцөлөөр цуцлах боломжтой:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Ресторан баталгаажуулаагүй тохиолдолд бүрэн буцаана</li>
                        <li>Хоол бэлтгэж эхэлсний дараа цуцлах боломжгүй</li>
                        <li>Хүргэгдсэн хоолны чанарын асуудал гарвал 24 цагийн дотор мэдэгдэх</li>
                        <li>Буцаалт тохиолдлоор тохирохгүй байх үед зураг, нотолгоо шаардагдана</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">6. Хэрэглэгчийн үүрэг</h3>
                    <p className="mb-2">
                        Та дараах зүйлсийг хийхгүй байхыг хүлээн зөвшөөрч байна:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Худал мэдээлэл өгөх</li>
                        <li>Бусдын бүртгэл ашиглах</li>
                        <li>Системд халдлага хийх, эвдэх</li>
                        <li>Хүргэгч, ресторанд зохисгүй хандах</li>
                        <li>Платформыг хууль бус зорилгоор ашиглах</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">7. Хариуцлагын хязгаарлалт</h3>
                    <p className="mb-2">
                        UB Delivery нь зуучлагч платформ бөгөөд хоолны чанар, аюулгүй байдалд ресторан хариуцлага хүлээнэ. 
                        Бид дараах зүйлд хариуцлага хүлээхгүй:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Хоолны чанар, амт, найрлага</li>
                        <li>Эрүүл ахуйн асуудал</li>
                        <li>Хоол хүнсний харшил</li>
                        <li>Гуравдагч этгээдийн үйлдэл</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">8. Нууцлал</h3>
                    <p>
                        Таны хувийн мэдээллийг манай Нууцлалын бодлогын дагуу хамгаална. 
                        Бид таны мэдээллийг гуравдагч этгээдэд зөвшөөрөлгүйгээр дамжуулахгүй.
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">9. Холбоо барих</h3>
                    <p className="mb-2">
                        Үйлчилгээний нөхцөлтэй холбоотой асуулт байвал бидэнтэй холбогдоно уу:
                    </p>
                    <ul className="list-none space-y-1">
                        <li><strong>И-мэйл:</strong> contact@ubdelivery.xyz</li>
                        <li><strong>Утас:</strong> 7011-7011</li>
                        <li><strong>Хаяг:</strong> Улаанбаатар хот, Монгол улс</li>
                    </ul>
                </section>

                <section className="border-t pt-4 mt-6">
                    <p className="text-xs text-gray-500">
                        <strong>Сүүлд шинэчилсэн:</strong> {new Date().toLocaleDateString('mn-MN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Эдгээр нөхцөлийг хүлээн зөвшөөрснөөр та UB Delivery платформыг ашиглах эрхтэй болно.
                    </p>
                </section>
            </div>
        </div>
    );
}
