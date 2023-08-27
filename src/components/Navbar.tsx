import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="mt-10">
      <h1 className="font-bold mb-3 text-3xl text-center">Shopify + Next.js 13!</h1>

      <ul className="text-center">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
