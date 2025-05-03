import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  visualElement?: React.ReactNode;
  videoSrc?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  visualElement,
  videoSrc,
}) => {
  return (
    <article className="flex flex-col items-center border w-80 bg-card/30 px-[30px] py-5 rounded-[30px] border-solid border-border">
      <div className="flex w-80 h-[180px] justify-center items-center bg-card/50 rounded-lg overflow-hidden">
        {videoSrc ? (
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          visualElement
        )}
      </div>
      {icon && (
        <div className="flex w-[70px] h-[71px] items-center mt-4">{icon}</div>
      )}
      <h3 className="text-foreground text-[22px] font-normal leading-[26.4px] tracking-[-0.44px] text-center mt-3">
        {title}
      </h3>
      <p className="text-foreground/70 text-base font-normal leading-[22.4px] tracking-[-0.32px] text-center mt-2">
        {description}
      </p>
    </article>
  );
};
