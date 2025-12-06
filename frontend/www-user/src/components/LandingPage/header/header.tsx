import HeaderDesktop from "./headerDesktop";
import HeaderMobile from "./headerMobile";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-lg shadow-gray-200/50">
            <HeaderDesktop />
            <HeaderMobile />
        </header>
    );
}