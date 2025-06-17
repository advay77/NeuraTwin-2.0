import React from "react";
import { Globe } from "@/components/magicui/globe";

const Feature = () => {
  return (
    <section className="mt-14 pt-20 ">
      <h3 className="font-sora text-3xl bg-gradient-to-b from-white via-gray-400 to-indigo-800/20 text-transparent bg-clip-text tracking-tight font-medium text-center px-4">
        Witness all the Possibilities
      </h3>
      <h1 className="font-orbitron text-4xl min-[800px]:text-5xl tracking-tight text-white mt-4 text-center px-4">
        New Way To Dominate Compitition
      </h1>
      <main className="relative w-full  pb-10">
        <div className="min-[600px]:px-10 px-6">
          <div className="relative bg-gray-900 w-full flex flex-col min-[700px]:max-w-2xl min-[1000px]:max-w-5xl mx-auto min-[900px]:h-[480px] h-[400px] mt-20 px-6 py-6 overflow-hidden rounded-2xl">
            <div className="flex flex-col max-[600px]:items-center max-[600px]:text-center max-[600px]:gap-6 min-[600px]:justify-between min-[600px]:flex-row gap-10 w-full items-center">
              <div>
                <h1 className="font-sora text-3xl text-white tracking-tight">
                  Tech used by around the{" "}
                  <span className="font-orbitron text-indigo-400">Globe</span>
                </h1>
                <p className="bg-gradient-to-b from-white via-gray-400 to-indigo-800/20 text-transparent bg-clip-text [-webkit-background-clip:text] font-sora mt-3 text-xl max-[600px]:text-center min-[600px]:text-left">
                  Become unstoppable with the power of AI, and unlock a world of
                  possibilities. Already used by thousands of people.
                </p>
              </div>
              <div className="max-[600px]:hidden min-[600px]:block text-center self-start">
                <h2 className="text-3xl font-orbitron text-indigo-400 font-bold">
                  300k
                </h2>
                <p className="font-inter text-gray-200 mt-3 text-xl">
                  Thousands of users are using and growing with NeuraTwin.
                </p>
              </div>
            </div>

            <div className="">
              <Globe className="min-[900px]:top-[35%] min-[600px]:top-[50%] min-[400px]:top-[55%] top-[62%]" />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Feature;
