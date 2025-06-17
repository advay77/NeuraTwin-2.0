import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Component() {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center ">
          {/* Card 1 - Do more with your data */}
          <Card className="relative overflow-hidden bg-white/30 border-0 rounded-3xl py-5 px-4 max-[600px]:p-7 max-[600px]:h-[340px]  h-[360px] flex flex-col justify-between ">
            {/* Animated decorative dots */}
            <div className="absolute top-0 -right-5 w-32 h-32 bg-indigo-400 rounded-full opacity-60 blur-xl "></div>
            <div className="absolute top-8 right-6 w-40 h-[40%] bg-indigo-300 rounded-[60%] opacity-40 blur-lg "></div>

            <div className="space-y-6 text-left">
              <div>
                <p className="text-sm text-gray-400 mb-4 font-orbitron tracking-tight">
                  Daily Journal
                </p>
                <h2 className="max-[400px]:text-3xl text-4xl font-semibold leading-tight font-sora bg-gradient-to-b from-white via-gray-300 to-indigo-600/20 text-transparent bg-clip-text [-webkit-background-clip:text]">
                  Do more with
                  <br />
                  <span className="">your Journal.</span>
                </h2>
              </div>

              <p className="max-[370px]:hidden text-gray-300 text-[18px] font-sora tracking-tight leading-tight text-left md:mt-10">
                NeuraTwin turns your thoughts into insights
                <br />
                that shape habits, track emotions
              </p>
            </div>

            <div className="flex justify-start">
              <Button
                variant="outline"
                className="w-fit rounded-full px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Learn More
              </Button>
            </div>
          </Card>

          {/* Card 2 - Connect Live Data */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-[#7B68DA] via-indigo-600 to-gray-950 border-0 rounded-3xl py-5 px-4  max-[600px]:p-7 max-[600px]:h-[340px] h-[360px] flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <p className="text-sm text-white font-inter text-left">
                AI-Powered Insights
              </p>

              <h2 className="max-[400px]:text-3xl text-4xl font-medium text-balance text-white leading-tight font-orbitron">
                AI Twin that learns
                <br />
                From Every Source.
              </h2>
            </div>

            <div className="flex justify-start">
              <Button
                variant="outline"
                className="w-fit rounded-full px-6 py-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </Card>

          {/* Card 3 - Data Virtualization */}
          <Card className="relative overflow-hidden bg-white/30 border-0 rounded-3xl py-5 px-4  max-[600px]:p-7 max-[600px]:h-[340px] h-[360px] flex flex-col justify-between">
            {/* Animated purple circles background */}
            <div className="absolute top-0 -right-5 w-32 h-32 bg-indigo-400 rounded-full opacity-60 blur-xl "></div>
            <div className="absolute top-8 right-6 w-40 h-[40%] bg-indigo-300 rounded-[60%] opacity-40 blur-lg "></div>

            <div
              className="absolute bottom-0 -right-5 w-32 h-1/3 bg-[#7B68DA] rounded-full opacity-50 blur-lg animate-pulse"
              // style={{ animationDelay: "1.2s", animationDuration: "2.5s" }}
            ></div>

            <div className="space-y-6 relative z-10 text-left">
              <p className="text-sm text-gray-400 font-orbitron">
                Track Progress
              </p>

              <h2 className="max-[400px]:text-3xl text-4xl font-bold leading-tight font-sora bg-gradient-to-b from-white via-gray-400 to-indigo-400/20 text-transparent bg-clip-text [-webkit-background-clip:text]">
                Become Unstoppable.
                <br />
                Growth Unbeliveble
              </h2>
            </div>

            <div className="flex sm:justify-start">
              <Button
                variant="outline"
                className="w-fit rounded-full px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 relative z-10"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
