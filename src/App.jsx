import { useEffect, useState } from "react";

function App() {
  const quotesKey = import.meta.env.VITE_QUOTES_KEY;
  const ipKey = import.meta.env.VITE_IP_KEY;

  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [weather, setWeather] = useState(null);
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [greetings, setGreetings] = useState("");
  const [isDay, setIsDay] = useState(true);

  const bgDay =
    "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/mobile/bg-image-daytime.jpg')] " +
    "md:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/tablet/bg-image-daytime.jpg')] " +
    "xl:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/desktop/bg-image-daytime.jpg')]";

  const bgNight =
    "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/mobile/bg-image-nighttime.jpg')] " +
    "md:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/tablet/bg-image-nighttime.jpg')] " +
    "xl:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('./assets/desktop/bg-image-nighttime.jpg')]";

  async function fetchQuotes() {
    const res = await fetch("https://api.api-ninjas.com/v2/randomquotes", {
      headers: {
        "X-Api-Key": quotesKey,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch quote");
    return res.json();
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [weatherRes, quoteData, ipRes] = await Promise.all([
          fetch("https://time.now/developer/api/ip"),
          fetchQuotes(),
          fetch("https://api.ipbase.com/v2/info", {
            headers: { apikey: ipKey },
          }),
        ]);

        if (!weatherRes.ok && !ipRes.ok) {
          const bodyWeater = await weatherRes.text();
          const bodyIp = await ipRes.text();
          throw new Error(
            `weather api ${weatherRes.status}: ${bodyWeater},ips api ${weatherRes.status}: ${bodyIp} `,
          );
        }

        if (!weatherRes.ok || !ipRes.ok) {
          if (!weatherRes.ok) {
            const body = await weatherRes.text();
            throw new Error(`weather api ${weatherRes.status}: ${body}`);
          } else if (!ipRes.ok) {
            const body = await ipRes.text();
            throw new Error(`ips api ${ipRes.status}: ${body}`);
          }
        }

        const weatherData = await weatherRes.json();
        const ipData = await ipRes.json();

        let currentHour = Number(
          ipData.data.timezone.current_time.slice(11, 13),
        );

        if (currentHour >= 5 && currentHour <= 11) {
          setGreetings("Good morning");
        } else if (currentHour >= 12 && currentHour < 18) {
          setGreetings("Good afternoon");
        } else setGreetings("Good evening");

        setIsDay(currentHour >= 5 && currentHour < 18);
        setWeather(weatherData);
        setQuote(quoteData);
        setIpData(ipData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenInfo = () => setIsOpen((prev) => !prev);

  const handleUpdateQuote = async () => {
    if (isQuoteLoading) return;
    setIsQuoteLoading(true);
    try {
      const newQuote = await fetchQuotes();
      setQuote(newQuote);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  return (
    <main
      className={`${isDay ? bgDay : bgNight} bg-cover bg-no-repeat bg-top min-h-screen `}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="min-h-screen mx-auto flex flex-col justify-between items-center">
          <div
            className={`${isOpen ? "hidden" : "flex"} items-start justify-center md:justify-start xl:mr-auto gap-4 pt-8 w-[91.46%] md:pt-16 md:w-[83.33%] xl:w-[77.08%] mx-auto`}
          >
            <p className="text-neutral-0 preset-6 flex flex-col gap-3 items-start justify-center">
              "{quote[0].quote}"
              <span className="preset-7">{quote[0].author}</span>
            </p>
            <button
              className="group cursor-pointer mt-1.5 rounded-full ml-auto"
              onClick={handleUpdateQuote}
              disabled={isQuoteLoading}
              aria-label="Get a new quote"
            >
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                className={`fill-neutral-0 opacity-50 group-hover:opacity-100 group-focus:opacity-100 ${isQuoteLoading ? "animate-spin" : ""}`}
              >
                <path
                  d="M7.188 10.667a.208.208 0 01.147.355l-2.344 2.206a5.826 5.826 0 009.578-2.488l2.387.746A8.322 8.322 0 013.17 14.94l-2.149 2.022a.208.208 0 01-.355-.148v-6.148h6.52zm7.617-7.63L16.978.958a.208.208 0 01.355.146v6.23h-6.498a.208.208 0 01-.147-.356L13 4.765A5.825 5.825 0 003.43 7.26l-2.386-.746a8.32 8.32 0 0113.76-3.477z"
                  fillRule="nonzero"
                />
              </svg>
            </button>
          </div>

          <div
            className={`flex flex-col xl:flex-row gap-16 md:gap-20 xl:gap-0 xl:justify-between ${isOpen ? "pt-20 md:pt-16 md:pb-29.5 xl:pb-0" : "pb-8 md:pb-16"}  w-[91.46%]  md:w-[83.33%] xl:w-[77.08%]`}
          >
            <div className="text-neutral-0 flex flex-col gap-6 md:gap-10">
              <p className="flex items-center justify-start gap-4 preset-5 uppercase">
                {isDay ? (
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.78 19.417c.594 0 1.083.449 1.146 1.026l.006.125v1.842a1.152 1.152 0 01-2.296.125l-.007-.125v-1.842c0-.636.516-1.151 1.152-1.151zM6.382 17.18a1.15 1.15 0 01.09 1.527l-.09.1-1.302 1.303a1.152 1.152 0 01-1.718-1.528l.09-.1 1.302-1.302a1.15 1.15 0 011.628 0zm12.427 0l1.303 1.303a1.15 1.15 0 11-1.628 1.627L17.18 18.81a1.15 1.15 0 111.628-1.628zM11.781 5.879a5.908 5.908 0 015.901 5.902 5.908 5.908 0 01-5.901 5.902 5.908 5.908 0 01-5.902-5.902 5.908 5.908 0 015.902-5.902zm10.63 4.75a1.151 1.151 0 110 2.303h-1.843a1.151 1.151 0 110-2.303h1.842zm-19.418 0a1.151 1.151 0 01.126 2.296l-.125.007H1.15a1.151 1.151 0 01-.125-2.296l.125-.007h1.842zm1.985-7.268l.1.09 1.303 1.302a1.151 1.151 0 01-1.528 1.718l-.1-.09L3.45 5.08A1.15 1.15 0 014.978 3.36zm15.133.09c.45.449.45 1.178 0 1.628L18.808 6.38a1.151 1.151 0 11-1.628-1.628l1.303-1.303c.449-.449 1.178-.449 1.628 0zM11.781 0c.636 0 1.151.515 1.151 1.151v1.843a1.152 1.152 0 01-2.303 0V1.15C10.63.515 11.145 0 11.781 0z"
                      fill="#FFF"
                      fillRule="nonzero"
                    />
                  </svg>
                ) : (
                  <svg
                    width="23"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.157 17.366a.802.802 0 00-.891-.248 8.463 8.463 0 01-2.866.482c-4.853 0-8.8-3.949-8.8-8.8a8.773 8.773 0 013.856-7.274.801.801 0 00-.334-1.454A7.766 7.766 0 0012 0C5.382 0 0 5.382 0 12s5.382 12 12 12c4.2 0 8.02-2.134 10.218-5.709a.805.805 0 00-.061-.925z"
                      fill="#FFF"
                      fillRule="nonzero"
                    />
                  </svg>
                )}

                <span>
                  {greetings}
                  <span className="hidden md:inline-block">
                    , IT'S CURRENTLY
                  </span>
                </span>
              </p>
              <p className="preset-1-mob md:preset-1 flex items-end gap-2">
                {ipData.data.timezone.current_time.slice(11, 16)}
                <span className="preset-3-mob md:preset-3">
                  {ipData.data.timezone.code}
                </span>
              </p>
              <p className="preset-4-mob md:preset-4 uppercase">
                IN {ipData.data.location.city.name},{" "}
                {ipData.data.location.country.fips}
              </p>
            </div>
            <button
              className="mr-auto w-36 group cursor-pointer py-2 pr-2 pl-5 bg-neutral-0 rounded-full preset-8 text-neutral-800 hover:text-neutral-500 flex items-center justify-between xl:self-end xl:mr-0  focus:ring-3 focus:ring-neutral-900 focus:shadow-[0_0_0_5px_#fff] focus:outline-none focus:text-neutral-500"
              onClick={handleOpenInfo}
            >
              {isOpen ? "LESS" : "MORE"}
              <span className="w-10 h-10 rounded-full bg-neutral-800 group-hover:bg-neutral-500 group-focus:bg-neutral-500 flex items-center justify-center ml-auto">
                <svg
                  width="14"
                  height="9"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-all duration-300 ease-in-out ${isOpen ? "-rotate-180" : ""}`}
                >
                  <path
                    stroke="#FFF"
                    strokeWidth="2"
                    fill="none"
                    d="m1 1 6 6 6-6"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div
            className={`py-12 md:py-28  w-full  preset-9-mob md:preset-9 text-neutral-800 bg-neutral-0/75 backdrop-blur-[1px] ${isOpen ? "opacity-100 h-full w-full  visible " : "opacity-0 h-0 w-0 collapse"}`}
          >
            <div className="overflow-hidden">
              <div className=" w-[91.46%] md:w-[83.33%] xl:w-[77.08%] grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-10 mx-auto">
                <p className="flex md:flex-col justify-between items-center md:items-start">
                  CURRENT TIMEZONE
                  <span className="preset-2-mob md:preset-2-tablet xl:preset-2">
                    {ipData.data.timezone.id}
                  </span>
                </p>
                <p className="flex md:flex-col justify-between items-center md:items-start">
                  DAY OF THE YEAR
                  <span className="preset-2-mob md:preset-2-tablet xl:preset-2">
                    {weather.day_of_year}
                  </span>
                </p>
                <p className="flex md:flex-col justify-between items-center md:items-start">
                  DAY OF THE WEEK
                  <span className="preset-2-mob md:preset-2-tablet xl:preset-2">
                    {weather.day_of_week}
                  </span>
                </p>
                <p className="flex md:flex-col justify-between items-center md:items-start">
                  WEEK NUMBER
                  <span className="preset-2-mob md:preset-2-tablet xl:preset-2">
                    {weather.week_number}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
