import HeaderDesktop from "./headerDesktop";
import HeaderMobile from "./headerMobile";

export default function HeaderHomeTopper() {
    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-lg shadow-gray-200/50 z-20">
            <HeaderDesktop />
            <HeaderMobile />
        </header>
    );
}