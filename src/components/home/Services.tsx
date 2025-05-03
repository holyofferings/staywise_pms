import React from "react";
import { ServiceCard } from "./ServiceCard";

export const Services: React.FC = () => {
  const targetIcon = (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            '<svg width="71" height="72" viewBox="0 0 71 72" fill="none" xmlns="http://www.w3.org/2000/svg" class="card-svg" style="width: 70px; height: 71px"> <g clip-path="url(#clip0_1_701)"> <mask id="mask0_1_701" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="2" width="69" height="69"> <path d="M34.868 2.12488C53.711 2.12488 68.986 17.4709 68.986 36.4019C68.986 55.3329 53.711 70.6799 34.868 70.6799C16.025 70.6799 0.75 55.3329 0.75 36.4019C0.75 17.4709 16.025 2.12488 34.868 2.12488Z" fill="currentColor"></path> </mask> <g mask="url(#mask0_1_701)"> <path d="M34.868 2.12488C53.711 2.12488 68.986 17.4709 68.986 36.4019C68.986 55.3329 53.711 70.6799 34.868 70.6799C16.025 70.6799 0.75 55.3329 0.75 36.4019C0.75 17.4709 16.025 2.12488 34.868 2.12488Z" stroke="currentColor" stroke-width="13.64"></path> </g> <mask id="mask1_1_701" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="14" y="15" width="42" height="42"> <path d="M34.868 15.8359C46.174 15.8359 55.339 25.0439 55.339 36.4019C55.339 47.7609 46.174 56.9689 34.868 56.9689C23.562 56.9689 14.397 47.7609 14.397 36.4019C14.397 25.0439 23.562 15.8359 34.868 15.8359Z" fill="currentColor"></path> </mask> <g mask="url(#mask1_1_701)"> <path d="M34.868 15.8359C46.174 15.8359 55.339 25.0439 55.339 36.4019C55.339 47.7609 46.174 56.9689 34.868 56.9689C23.562 56.9689 14.397 47.7609 14.397 36.4019C14.397 25.0439 23.562 15.8359 34.868 15.8359Z" stroke="currentColor" stroke-width="10.92"></path> </g> <mask id="mask2_1_701" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="28" y="29" width="14" height="15"> <path d="M34.868 29.5469C38.637 29.5469 41.692 32.6159 41.692 36.4019C41.692 40.1889 38.637 43.2579 34.868 43.2579C31.1 43.2579 28.045 40.1889 28.045 36.4019C28.045 32.6159 31.1 29.5469 34.868 29.5469Z" fill="currentColor"></path> </mask> <g mask="url(#mask2_1_701)"> <path d="M34.868 29.5469C38.637 29.5469 41.692 32.6159 41.692 36.4019C41.692 40.1889 38.637 43.2579 34.868 43.2579C31.1 43.2579 28.045 40.1889 28.045 36.4019C28.045 32.6159 31.1 29.5469 34.868 29.5469Z" stroke="currentColor" stroke-width="10.92"></path> </g> <path d="M34.868 36.4019L66.257 4.86694" stroke="hsl(var(--primary))" stroke-width="2.31"></path> <path d="M63.945 7.62692L64.698 1.63192L70.703 1.29492L69.95 7.28992L63.945 7.62692Z" fill="hsl(var(--primary))"></path> </g> <defs> <clipPath id="clip0_1_701"> <rect width="70" height="71" fill="currentColor" transform="translate(0.75 0.679932)"></rect> </clipPath> </defs> </svg>',
        }}
      />
    </div>
  );

  const visualizationBars = (
    <div className="flex gap-[7px]">
      <div className="w-2 h-[30px] bg-primary/70" />
      <div className="w-2 h-[30px] bg-primary/70" />
      <div className="w-2 h-[30px] bg-primary/70" />
      <div className="w-2 h-[30px] bg-primary/70" />
    </div>
  );

  // Development & Test visual element
  const developmentVisual = (
    <div className="flex flex-col items-center justify-center w-full h-full bg-primary/20 rounded-md p-2">
      <div className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center mb-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H16M8 3V5H16V3M8 3H16M9 13L11 15L15 11" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex space-x-1 mb-2">
        <div className="w-2 h-8 bg-primary/60 rounded-sm"></div>
        <div className="w-2 h-10 bg-primary/80 rounded-sm"></div>
        <div className="w-2 h-6 bg-primary/60 rounded-sm"></div>
        <div className="w-2 h-12 bg-primary rounded-sm"></div>
      </div>
      <div className="text-xs text-foreground font-light">Maintenance Card</div>
    </div>
  );

  return (
    <section className="flex w-full justify-center items-center px-10 py-[100px]">
      <div className="flex flex-col items-center gap-[60px]">
        <h2 className="text-foreground text-[50px] font-medium leading-[60px] tracking-[-1px] text-center">
          Your path to excellence
        </h2>
        <p className="text-foreground/80 text-lg font-normal leading-[27px] tracking-[-0.36px] text-center">
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
            visualElement={developmentVisual}
          />
          <ServiceCard
            title="AI Booking Assistant"
            description="Let our AI handle your hotel bookings automatically while you focus on providing great service."
            videoSrc="/videos/booking-demo.mp4"
          />
        </div>
      </div>
    </section>
  );
};
