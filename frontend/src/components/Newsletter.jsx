import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setStatus("Thanks for subscribing! Check your inbox soon.");
    setEmail("");
  };

  return (
    <section className="lux-container py-16">
      <div className="rounded-[2rem] border border-black/10 bg-white p-10 text-center shadow-soft">
        <p className="section-subtitle">Newsletter</p>
        <h2 className="section-title gold-underline">Stay Updated</h2>
        <p className="mx-auto max-w-2xl text-sand">Subscribe for new arrivals, exclusive launches, and limited-time offers.</p>
        <form onSubmit={handleSubscribe} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            className="w-full max-w-md rounded-full border border-black/10 bg-paper px-5 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <button className="lux-button rounded-full px-8 py-3" type="submit">
            Subscribe
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-sand">{status}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
