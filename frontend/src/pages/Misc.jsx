export const Events = () => (
  <div className="max-w-5xl mx-auto px-6 py-12">
    <h1 className="text-2xl font-bold mb-6">Upcoming Events & Flash Sales</h1>
    <p className="text-gray-500">Check back soon — vendors will post seasonal sales and flash-deal events here.</p>
  </div>
);

export const FAQ = () => {
  const faqs = [
    { q: "How do I become a seller?", a: "Click 'Become Seller', sign up, and start listing your products once approved." },
    { q: "What payment methods are supported?", a: "We support card payments via Stripe and Cash on Delivery." },
    { q: "How do refunds work?", a: "Contact the seller through your order's message thread, or open a refund request from your profile." },
    { q: "Is shipping tracked?", a: "Yes — track your order status from the Profile > Track Order tab." },
  ];
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="border rounded-md p-4">
            <p className="font-medium">{f.q}</p>
            <p className="text-gray-500 text-sm mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BecomeSeller = () => (
  <div className="max-w-2xl mx-auto px-6 py-20 text-center">
    <h1 className="text-2xl font-bold mb-3">Become a Seller on ShopO</h1>
    <p className="text-gray-500 mb-6">Sign up and choose "Seller" during registration to start your own shop.</p>
    <a href="/signup" className="bg-primary text-white px-6 py-3 rounded-md font-medium inline-block">Sign up as Seller</a>
  </div>
);
