import Header from "@/components/LandingPage/header/header";
import Footer from "@/components/LandingPage/footer/footer";

export default function Policy() {
  return (
    <div className="bg-white font-sans flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4 mt-32 mb-24">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Нууцлалын бодлого
          </h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Танилцуулга</h2>
              <p className="mb-3">
                UB Delivery нь таны хувийн мэдээллийн нууцлалыг хамгаалахад онцгой анхаарал хандуулдаг. 
                Энэхүү бодлого нь бидний цуглуулж буй мэдээлэл, түүнийг хэрхэн ашиглаж, хамгаалж байгааг 
                тайлбарладаг.
              </p>
              <p>
                Манай үйлчилгээг ашигласнаар та энэхүү нууцлалын бодлогыг хүлээн зөвшөөрч байна.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Цуглуулдаг мэдээлэл</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Хувийн мэдээлэл</h3>
              <p className="mb-3">Бид дараах хувийн мэдээллийг цуглуулж болно:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Нэр, овог</li>
                <li>Утасны дугаар</li>
                <li>Цахим шуудангийн хаяг</li>
                <li>Хүргэлтийн хаяг</li>
                <li>Төлбөрийн мэдээлэл (картын мэдээлэл шифрлэгдсэн хэлбэрээр)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Автоматаар цуглуулах мэдээлэл</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP хаяг</li>
                <li>Төхөөрөмжийн мэдээлэл</li>
                <li>Байршлын мэдээлэл (зөвшөөрөл өгсөн тохиолдолд)</li>
                <li>Вэбсайт ашиглалтын мэдээлэл (cookies)</li>
                <li>Захиалгын түүх</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Мэдээлэл ашиглалт</h2>
              <p className="mb-3">Бид таны мэдээллийг дараах зорилгоор ашигладаг:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Захиалга боловсруулах, хүргэх</li>
                <li>Үйлчилгээний чанарыг сайжруулах</li>
                <li>Таны хүсэлт, санал хүсэлтэд хариу өгөх</li>
                <li>Захиалгын явцын талаар мэдэгдэл илгээх</li>
                <li>Урамшуулал, хөнгөлөлтийн талаар мэдээлэх</li>
                <li>Залилан, хууль бус үйлдлээс хамгаалах</li>
                <li>Хууль тогтоомжийн шаардлага биелүүлэх</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Мэдээлэл хуваалцах</h2>
              <p className="mb-3">
                Бид таны хувийн мэдээллийг дараах тохиолдолд гуравдагч этгээдтэй хуваалцаж болно:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">4.1 Үйлчилгээний түншүүд</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ресторанууд (захиалгыг хүлээн авах, бэлтгэх)</li>
                <li>Хүргэлтийн ажилтнууд (хүргэлт хийх)</li>
                <li>Төлбөр боловсруулах үйлчилгээ</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Хуулийн шаардлага</h3>
              <p className="mb-3">
                Хууль тогтоомжийн шаардлагаар, шүүхийн шийдвэр эсвэл төрийн байгууллагын хүсэлтээр 
                мэдээлэл өгөх шаардлагатай тохиолдол.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Бизнесийн шилжилт</h3>
              <p>
                Компани нэгдэх, худалдан авах, эсвэл хөрөнгө шилжүүлэх тохиолдолд таны мэдээлэл 
                шинэ эзэнд шилжиж болно.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Мэдээллийн хамгаалалт</h2>
              <p className="mb-3">
                Бид таны хувийн мэдээллийг хамгаалахын тулд дараах арга хэмжээ авч байна:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL шифрлэлт ашиглах</li>
                <li>Аюулгүй сервер ашиглах</li>
                <li>Мэдээллийн санд нэвтрэх эрхийг хязгаарлах</li>
                <li>Ажилчдад нууцлалын сургалт явуулах</li>
                <li>Аюулгүй байдлын тогтмол шалгалт хийх</li>
              </ul>
              <p className="mt-3">
                Гэсэн хэдий ч интернетээр дамжуулах ямар ч арга нь 100% найдвартай байж чадахгүй гэдгийг 
                анхаарна уу.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Cookies болон технологи</h2>
              <p className="mb-3">
                Бид cookies болон үүнтэй төстэй технологи ашиглан таны туршлагыг сайжруулдаг:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Шаардлагатай cookies:</strong> Вэбсайтын үндсэн функц ажиллуулах</li>
                <li><strong>Функциональ cookies:</strong> Таны сонголт хадгалах</li>
                <li><strong>Шинжилгээний cookies:</strong> Вэбсайтын ашиглалтыг ойлгох</li>
                <li><strong>Маркетингийн cookies:</strong> Таны сонирхолд нийцсэн сурталчилгаа үзүүлэх</li>
              </ul>
              <p className="mt-3">
                Та хөтчийн тохиргоогоор cookies-г идэвхгүй болгож болно.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Таны эрх</h2>
              <p className="mb-3">Та дараах эрхтэй:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Өөрийн мэдээлэлд нэвтрэх, үзэх</li>
                <li>Мэдээллээ засварлах, шинэчлэх</li>
                <li>Мэдээллээ устгахыг хүсэх</li>
                <li>Боловсруулалтад эсэргүүцэх</li>
                <li>Мэдээллээ өөр платформд шилжүүлэх</li>
                <li>Маркетингийн имэйл хүлээн авахаас татгалзах</li>
              </ul>
              <p className="mt-3">
                Эдгээр эрхээ эдлэхийг хүсвэл бидэнтэй холбогдоно уу.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Хүүхдийн нууцлал</h2>
              <p>
                Манай үйлчилгээ 18 наснаас доош хүүхдэд зориулаагүй. Бид санаатайгаар 18 хүрээгүй 
                хүүхдүүдээс хувийн мэдээлэл цуглуулдаггүй. Хэрэв та эцэг эх бөгөөд таны хүүхэд бидэнд 
                мэдээлэл өгсөн гэж үзвэл бидэнтэй холбогдоно уу.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Олон улсын шилжүүлэлт</h2>
              <p>
                Таны мэдээлэл Монгол улсаас гадуур боловсруулагдаж болно. Бид таны мэдээллийг хамгаалах 
                зохих арга хэмжээ авснаар шилжүүлнэ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Өөрчлөлт</h2>
              <p>
                Бид энэхүү нууцлалын бодлогыг цаг хугацааны явцад шинэчилж болно. Томоохон өөрчлөлт 
                орсон тохиолдолд и-мэйлээр мэдэгдэнэ. Үйлчилгээг үргэлжлүүлэн ашиглах нь өөрчлөлтийг 
                хүлээн зөвшөөрсөн гэсэн үг юм.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Холбоо барих</h2>
              <p className="mb-3">
                Нууцлалын бодлоготой холбоотой асуулт байвал бидэнтэй холбогдоно уу:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>И-мэйл:</strong> privacy@ubdelivery.xyz</li>
                <li><strong>Утас:</strong> 7011-7011</li>
                <li><strong>Хаяг:</strong> Улаанбаатар хот, Монгол улс</li>
              </ul>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-600">
                <strong>Сүүлд шинэчилсэн:</strong> {new Date().toLocaleDateString('mn-MN')}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                UB Delivery нь таны мэдээллийн нууцлал, аюулгүй байдлыг хангахад тууштай ажиллаж байна.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}