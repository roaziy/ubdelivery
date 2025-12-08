import Link from 'next/link'
import Image from 'next/image'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
        {/* <h2>Not Found</h2>
        <p>Could not find requested resource</p> */}
        <Image
            src="/logos/logoSmall.svg"
            alt="UB Delivery Logo"
            width={300}
            height={300}
            className="mb-8 select-none w-[50px] h-[50px]"
            draggable={false}
        />
        <h2 className='text-xl font-bold mb-4 text-center'>404 - Хуудас олдсонгүй</h2>
        <Link href="/">Return Home</Link>
    </div>
  )
}