import React from "react";
import { ServiceCard } from "./ServiceCard";

export const Services: React.FC = () => {
  const targetIcon = (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            '<svg width="71" height="72" viewBox="0 0 71 72" fill="none" xmlns="http://www.w3.org/2000/svg" class="card-svg" style="width: 70px; height: 71px"> <g clip-path="url(#clip0_1_701)"> <mask id="mask0_1_701" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="2" width="69" height="69"> <path d="M34.868 2.12488C53.711 2.12488 68.986 17.4709 68.986 36.4019C68.986 55.3329 53.711 70.6799 34.868 70.6799C16.025 70.6799 0.75 55.3329 0.75 36.4019C0.75 17.4709 16.025 2.12488 34.868 2.12488Z" fill="white"></path> </mask> <g mask="url(#mask0_1_701)"> <path d="M34.868 2.12488C53.711 2.12488 68.986 17.4709 68.986 36.4019C68.986 55.3329 53.711 70.6799 34.868 70.6799C16.025 70.6799 0.75 55.3329 0.75 36.4019C0.75 17.4709 16.025 2.12488 34.868 2.12488Z" stroke="#AAAAAA" stroke-width="13.64"></path> </g> <mask id="mask1_1_701" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="14" y="15" width="42" height="42"> <path d="M34.868 15.8359C46.174 15.8359 55.339 25.0439 55.339 36.4019C55.339 47.7609 46.174 56.9689 34.868 56.9689C23.562 56.9689 14.397 47.7609 14.397 36.4019C14.397 25.0439 23.562 15.8359 34.868 15.8359Z" fill="white"></path> </mask> <g mask="url(#mask1_1_701)"> <path d="M34.868 15.8359C46.174 15.8359 55.339 25.0439 55.339 36.4019C55.339 47.7609 46.174 56.9689 34.868 56.9689C23.562 56.9689 14.397 47.7609 14.397 36.4019C14.397 25.0439 23.562 15.8359 34.868 15.8359Z" stroke="#AAAAAA" stroke-width="10.92"></path> </g> <mask id="mask2_1_701" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="28" y="29" width="14" height="15"> <path d="M34.868 29.5469C38.637 29.5469 41.692 32.6159 41.692 36.4019C41.692 40.1889 38.637 43.2579 34.868 43.2579C31.1 43.2579 28.045 40.1889 28.045 36.4019C28.045 32.6159 31.1 29.5469 34.868 29.5469Z" fill="white"></path> </mask> <g mask="url(#mask2_1_701)"> <path d="M34.868 29.5469C38.637 29.5469 41.692 32.6159 41.692 36.4019C41.692 40.1889 38.637 43.2579 34.868 43.2579C31.1 43.2579 28.045 40.1889 28.045 36.4019C28.045 32.6159 31.1 29.5469 34.868 29.5469Z" stroke="#AAAAAA" stroke-width="10.92"></path> </g> <path d="M34.868 36.4019L66.257 4.86694" stroke="#422AAD" stroke-width="2.31"></path> <path d="M63.945 7.62692L64.698 1.63192L70.703 1.29492L69.95 7.28992L63.945 7.62692Z" fill="#422AAD"></path> </g> <defs> <clipPath id="clip0_1_701"> <rect width="70" height="71" fill="white" transform="translate(0.75 0.679932)"></rect> </clipPath> </defs> </svg>',
        }}
      />
    </div>
  );

  const visualizationBars = (
    <div className="flex gap-[7px]">
      <div className="w-2 h-[30px] bg-[rgba(81,47,235,0.70)]" />
      <div className="w-2 h-[30px] bg-[rgba(81,47,235,0.70)]" />
      <div className="w-2 h-[30px] bg-[rgba(81,47,235,0.70)]" />
      <div className="w-2 h-[30px] bg-[rgba(81,47,235,0.70)]" />
    </div>
  );

  return (
    <section className="flex w-full justify-center items-center px-10 py-[100px]">
      <div className="flex flex-col items-center gap-[60px]">
        <h2 className="text-white text-[50px] font-medium leading-[60px] tracking-[-1px] text-center">
          Your path to excellence
        </h2>
        <p className="text-[rgba(255,255,255,0.8)] text-lg font-normal leading-[27px] tracking-[-0.36px] text-center">
          A simple, effective approach to deliver excellence.
        </p>
        <div className="flex gap-[30px]">
          <ServiceCard
            title="Discovery &amp; Analysis"
            description="We dive deep into your needs, exploring ideas and defining strategies for long-term success."
            icon={targetIcon}
            visualElement={visualizationBars}
          />
          <ServiceCard
            title="Development &amp; Test"
            description="We craft tailored solutions for your goals and rigorously test them for top-notch reliability."
          />
        </div>
      </div>
    </section>
  );
};
