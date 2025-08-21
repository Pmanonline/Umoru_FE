import { useSelector } from "react-redux";

const SupportPage = () => {
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <header className="bg-white dark:bg-accent-creamDark py-6">
        <div className="container mx-auto text-center">
          <h1 className="font-montserrat-subrayada text-4xl text-primary dark:text-primary-darkMode">
            Support
          </h1>
        </div>
      </header>
      <main className="container mx-auto py-12">
        <section className="text-center">
          <p className="font-montserrat text-accent-charcoal dark:text-accent-charcoalDark mb-6">
            Get in touch or join our community for support and guidance.
          </p>
          <a
            href="/telegram"
            className="bg-accent-green hover:bg-accent-green/80 text-white py-3 px-6 rounded hover:scale-up inline-block">
            Join Telegram Community
          </a>
          <p className="font-montserrat text-accent-charcoal dark:text-accent-charcoalDark mt-6">
            Email: support@segunumoru.com
          </p>
        </section>
      </main>
    </div>
  );
};

export default SupportPage;
