import { useEffect, useState } from "react";
import dayBackground from "./assets/mobile/bg-image-daytime.jpg";

function App() {
  const [weather, setWeather] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        const [weatherRes, quoteRes] = await Promise.all([
          fetch("https://time.now/developer/api/ip"),
          fetch("https://api.api-ninjas.com/v2/randomquotes"),
        ]);

        if (!weatherRes.ok || !quoteRes.ok) throw Error("Something went wrong");
        setWeather(await weatherRes.json());
        setQuote(await quoteRes.json());
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/mobile/bg-image-daytime.jpg')] bg-cover bg-no-repeat h-full ">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="flex items-start justify-center gap-4">
          <p className="text-neutral-0 preset-6 flex flex-col gap-3 items-start justify-center">
            "{quote[0].quote}"
            <span className="preset-7">{quote[0].author}</span>
          </p>
          <button className="group cursor-pointer">
            <svg
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-neutral-0 opacity-50 group-hover:opacity-100"
            >
              <path
                d="M7.188 10.667a.208.208 0 01.147.355l-2.344 2.206a5.826 5.826 0 009.578-2.488l2.387.746A8.322 8.322 0 013.17 14.94l-2.149 2.022a.208.208 0 01-.355-.148v-6.148h6.52zm7.617-7.63L16.978.958a.208.208 0 01.355.146v6.23h-6.498a.208.208 0 01-.147-.356L13 4.765A5.825 5.825 0 003.43 7.26l-2.386-.746a8.32 8.32 0 0113.76-3.477z"
                s
                fillRule="nonzero"
              />
            </svg>
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
