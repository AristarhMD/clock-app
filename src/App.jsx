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

        const weatherData = await weatherRes.json();
        const quoteData = await quoteRes.json();
        console.log(weatherData);
        setWeather(weatherData);
        setQuote(quoteData);
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
        <section className="h-full py-8 w-[91.46%] md:py-16 md:w-[83.33%] xl:w-[77.08%] mx-auto flex flex-col justify-between">
          <div className="flex items-start justify-center gap-4">
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
                  fillRule="nonzero"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col xl:flex-row gap-16 md:gap-20 xl:justify-between">
            <div className="text-neutral-0 flex flex-col gap-6 md:gap-10">
              <p className="flex items-center justify-start gap-4 preset-5">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.78 19.417c.594 0 1.083.449 1.146 1.026l.006.125v1.842a1.152 1.152 0 01-2.296.125l-.007-.125v-1.842c0-.636.516-1.151 1.152-1.151zM6.382 17.18a1.15 1.15 0 01.09 1.527l-.09.1-1.302 1.303a1.152 1.152 0 01-1.718-1.528l.09-.1 1.302-1.302a1.15 1.15 0 011.628 0zm12.427 0l1.303 1.303a1.15 1.15 0 11-1.628 1.627L17.18 18.81a1.15 1.15 0 111.628-1.628zM11.781 5.879a5.908 5.908 0 015.901 5.902 5.908 5.908 0 01-5.901 5.902 5.908 5.908 0 01-5.902-5.902 5.908 5.908 0 015.902-5.902zm10.63 4.75a1.151 1.151 0 110 2.303h-1.843a1.151 1.151 0 110-2.303h1.842zm-19.418 0a1.151 1.151 0 01.126 2.296l-.125.007H1.15a1.151 1.151 0 01-.125-2.296l.125-.007h1.842zm1.985-7.268l.1.09 1.303 1.302a1.151 1.151 0 01-1.528 1.718l-.1-.09L3.45 5.08A1.15 1.15 0 014.978 3.36zm15.133.09c.45.449.45 1.178 0 1.628L18.808 6.38a1.151 1.151 0 11-1.628-1.628l1.303-1.303c.449-.449 1.178-.449 1.628 0zM11.781 0c.636 0 1.151.515 1.151 1.151v1.843a1.152 1.152 0 01-2.303 0V1.15C10.63.515 11.145 0 11.781 0z"
                    fill="#FFF"
                    fillRule="nonzero"
                  />
                </svg>
                <span>
                  GOOD MORNING
                  <span className="hidden md:inline-block">
                    , IT'S CURRENTLY
                  </span>
                </span>
              </p>
              <p className="preset-1-mob md:preset-1">
                11:37 <span className="preset-3-mob md:preset-3s">BST</span>
              </p>
              <p className="preset-4-mob md:preset-4">IN LONDON, UKs</p>
            </div>
            <button className="cursor-pointer py-2 w-36 bg-neutral-0 rounded-full preset-8 text-neutral-800 flex items-center justify-center gap-3">
              MORE
              <span className="size-10 rounded-full bg-neutral-800 flex items-center justify-center">
                <svg width="14" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    stroke="#FFF"
                    stroke-width="2"
                    fill="none"
                    d="m1 1 6 6 6-6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
