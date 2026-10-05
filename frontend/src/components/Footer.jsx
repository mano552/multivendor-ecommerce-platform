import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";

const brands = ["Dell", "Apple", "LG", "Sony", "Microsoft"];

const Footer = () => {
  return (
    <footer className="mt-16">
      {/* Subscribe bar */}
      <div className="bg-primary text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">
            Subscribe <span className="font-normal">us for get news events and offers</span>
          </h3>
          <form className="flex w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email..."
              className="px-4 py-2 rounded-l-md text-gray-800 w-full md:w-72 outline-none"
            />
            <button className="bg-accent px-6 py-2 rounded-r-md font-medium">Submit</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="bg-gray-900 text-gray-300 px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white mb-2">
              Shop<span className="text-primary">O</span>
            </div>
            <p className="text-sm mb-4">The home and elements needed to create beautiful products.</p>
            <div className="flex gap-4 text-xl">
              <FiFacebook /> <FiTwitter /> <FiInstagram /> <FiYoutube />
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About us</li>
              <li>Careers</li>
              <li>Store Locations</li>
              <li>Our Blog</li>
              <li>Reviews</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Game & Video</li>
              <li>Phone & Tablets</li>
              <li>Computers & Laptop</li>
              <li>Sport Watches</li>
              <li>Events</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>FAQ</li>
              <li>Reviews</li>
              <li>Contact Us</li>
              <li>Shipping</li>
              <li>Live chat</li>
            </ul>
          </div>
        </div>

        {/* Brand partners */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 flex flex-wrap items-center justify-center gap-8 text-gray-400 font-semibold tracking-wide">
          {brands.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 ShopO. All rights reserved.</p>
          <p>Terms · Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
