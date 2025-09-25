import { IpSearch, IpInfo } from "../components/Ip/Ip";

export function Main({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Blue Hero */}
      <section
        className="relative bg-gradient-to-b from-indigo-600 to-indigo-500
                    pt-12 pb-44 md:pb-48 px-4"
      >
        <h1 className="text-white text-2xl md:text-3xl font-medium text-center">
          IP Address Tracker
        </h1>

        {/* Search */}
        <div className="relative z-30 mt-6 w-full max-w-[560px] mx-auto">
          <IpSearch onSubmit={(val) => console.log("submit:", val)} />
        </div>

        {/* Info card overlay */}
        <div
          className="absolute inset-x-0 top-full -translate-y-1/2 z-20
                  flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-[1100px] px-4 pointer-events-auto">
            <IpInfo
              ip="192.212.174.101"
              location={"Brooklyn, NY\n10001"}
              timezone="UTC −05:00"
              isp={"SpaceX\nStarlink"}
            />
          </div>
        </div>
      </section>

      {/* Map section */}
      <section className="relative">
        <div
          id="map"
          className="h-[520px] w-full bg-gray-200 dark:bg-gray-800 grid place-items-center"
        >
          <span className="text-gray-600 dark:text-gray-300">
            Map goes here
          </span>
        </div>
      </section>
    </main>
  );
}
