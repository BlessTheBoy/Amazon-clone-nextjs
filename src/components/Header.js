import Image from "next/image";
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";

function Header() {
  return (
    <header>
      {/* Top Nav */}
      <div className="flex items-center bg-amazon_blue p1 flex-grow py-2">
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            src="https://links.papareact.com/f90"
            width={150}
            height={40}
            objectFit="contain"
            className="cursor-pointer"
          />
        </div>

        {/* search */}
        <div className="hidden sm:flex h-10 rounded-md flex-grow bg-yellow-400 hover:bg-yellow-500">
          <input
            type="text"
            name=""
            id=""
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
          />
          <SearchIcon className="h-12 p-4" />
        </div>

        {/* Right */}
        <div className="text-white">
          <div>
            <p>Hello, BlessTheBoy</p>
            <p>Acconts & Lists</p>
          </div>
          <div>
            <p>Return</p>
            <p>& Orders</p>
          </div>
          <div>
            <ShoppingCartIcon className="h-10" />
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div></div>
    </header>
  );
}

export default Header;
