import Header from "@/components/LandingPage/header/header";
import Footer from "@/components/LandingPage/footer/footer";

export default function Terms() {
  return (
    <div className="bg-white font-sans flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4 mt-32 mb-24">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Үйлчилгээний нөхцөл
          </h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Ерөнхий үндэслэл</h2>
              <p className="mb-3">
                UB Delivery нь хоол хүргэх платформ бөгөөд хэрэглэгч, ресторан, хүргэлтийн ажилтнуудыг холбох үйлчилгээ юм. 
                Манай платформыг ашигласнаар та эдгээр үйлчилгээний нөхцөлийг хүлээн зөвшөөрч байна.
              </p>
              <p>
                Үйлчилгээний нөхцөл нь цаг хугацааны явцад өөрчлөгдөж болно. Таныг тогтмол шалгаж, шинэчлэлтийг мэдэх үүрэгтэй.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Хэрэглэгчийн бүртгэл</h2>
              <p className="mb-3">
                Платформыг ашиглахын тулд та үнэн зөв мэдээлэл өгч, бүртгүүлэх шаардлагатай. Та өөрийн бүртгэлийн 
                мэдээллийг нууцлах үүрэгтэй бөгөөд бүртгэлтэй холбоотой бүх үйл ажиллагаанд хариуцлага хүлээнэ.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>18 нас хүрсэн байх шаардлагатай</li>
                <li>Хүчинтэй цахим шуудангийн хаяг ба утасны дугаар өгөх</li>
                <li>Нууц үгээ аюулгүй хадгалах</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Захиалга болон төлбөр</h2>
              <p className="mb-3">
                Та захиалга өгснөөр тухайн бүтээгдэхүүн, үйлчилгээг худалдан авах гэрээ байгуулж байна. 
                Бүх захиалга нь ресторанаас баталгаажих шаардлагатай.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Үнэ, хүргэлтийн төлбөр нь захиалгын үед тодорхой заагдана</li>
                <li>Төлбөрийг картаар эсвэл бэлнээр хийж болно</li>
                <li>Хүргэлтийн хураамж нь зайнаас хамаарна</li>
                <li>Урамшуулал, хөнгөлөлт нь тодорхой нөхцөлтэй байж болно</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Хүргэлт</h2>
              <p className="mb-3">
                Бид найдвартай, түргэн хүргэлтийг эрмэлздэг боловч хүргэлтийн хугацаа нь цаг агаар, 
                замын нөхцөл, захиалгын тоо зэргээс хамаарч өөрчлөгдөж болно.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Хүргэлтийн хугацаа нь ойролцоогоор тооцоолсон</li>
                <li>Хаягийн мэдээлэл үнэн зөв байх шаардлагатай</li>
                <li>Хүргэгч таньд утсаар холбогдох боломжтой байх</li>
                <li>Хүргэлт хийх боломжгүй тохиолдолд мэдэгдэх болно</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Цуцлах болон буцаах</h2>
              <p className="mb-3">
                Захиалгыг тодорхой нөхцөлөөр цуцлах боломжтой:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ресторан баталгаажуулаагүй тохиолдолд бүрэн буцаана</li>
                <li>Хоол бэлтгэж эхэлсний дараа цуцлах боломжгүй</li>
                <li>Хүргэгдсэн хоолны чанарын асуудал гарвал 24 цагийн дотор мэдэгдэх</li>
                <li>Буцаалт тохиолдлоор тохирохгүй байх үед зураг, нотолгоо шаардагдана</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Хэрэглэгчийн үүрэг</h2>
              <p className="mb-3">
                Та дараах зүйлсийг хийхгүй байхыг хүлээн зөвшөөрч байна:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Худал мэдээлэл өгөх</li>
                <li>Бусдын бүртгэл ашиглах</li>
                <li>Системд халдлага хийх, эвдэх</li>
                <li>Хүргэгч, ресторанд зохисгүй хандах</li>
                <li>Платформыг хууль бус зорилгоор ашиглах</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Хариуцлагын хязгаарлалт</h2>
              <p className="mb-3">
                UB Delivery нь зуучлагч платформ бөгөөд хоолны чанар, аюулгүй байдалд ресторан хариуцлага хүлээнэ. 
                Бид дараах зүйлд хариуцлага хүлээхгүй:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Хоолны чанар, амт, найрлага</li>
                <li>Эрүүл ахуйн асуудал</li>
                <li>Хоол хүнсний харшил</li>
                <li>Гуравдагч этгээдийн үйлдэл</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Нууцлал</h2>
              <p>
                Таны хувийн мэдээллийг манай Нууцлалын бодлогын дагуу хамгаална. 
                Бид таны мэдээллийг гуравдагч этгээдэд зөвшөөрөлгүйгээр дамжуулахгүй.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Холбоо барих</h2>
              <p className="mb-3">
                Үйлчилгээний нөхцөлтэй холбоотой асуулт байвал бидэнтэй холбогдоно уу:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>И-мэйл:</strong> contact@ubdelivery.xyz</li>
                <li><strong>Утас:</strong> 7011-7011</li>
                <li><strong>Хаяг:</strong> Улаанбаатар хот, Монгол улс</li>
              </ul>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-600">
                <strong>Сүүлд шинэчилсэн:</strong> {new Date().toLocaleDateString('mn-MN')}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Эдгээр нөхцөлийг хүлээн зөвшөөрснөөр та UB Delivery платформыг ашиглах эрхтэй болно.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}