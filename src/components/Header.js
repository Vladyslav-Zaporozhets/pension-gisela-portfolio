import Link from "next/link"; // <Link> - це як <a>, але для Next.js

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Логотип (веде на Головну) */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Pension Gisela
        </Link>

        {/* Меню Навігації */}
        <div className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Головна
          </Link>
          <Link href="/gallery" className="text-gray-600 hover:text-gray-800">
            Галерея
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-800">
            Контакти
          </Link>
        </div>
      </nav>
    </header>
  );
}
