const FAQSection = ({ faqs }) => {
  return (
    <section className="lux-container py-16">
      <div className="space-y-6">
        <p className="section-subtitle">FAQ</p>
        <h2 className="section-title gold-underline">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-3xl border border-black/10 bg-white p-6 transition hover:border-gold"
            >
              <summary className="cursor-pointer text-lg font-semibold text-ink list-none">
                {faq.question}
              </summary>
              <p className="mt-4 text-sand">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
