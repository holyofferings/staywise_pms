import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  visualElement?: React.ReactNode;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  visualElement,
}) => {
  return (
    <article className="flex flex-col items-center border w-80 bg-[rgba(255,255,255,0.06)] px-[30px] py-5 rounded-[30px] border-solid border-[rgba(255,255,255,0.10)]">
      <div className="flex w-80 h-[180px] justify-center items-center bg-[rgba(255,255,255,0.12)] rounded-lg">
        {visualElement}
      </div>
      {icon && (
        <div className="flex w-[70px] h-[71px] items-center">{icon}</div>
      )}
      <h3 className="text-white text-[22px] font-normal leading-[26.4px] tracking-[-0.44px] text-center">
        {title}
      </h3>
      <p className="text-[rgba(255,255,255,0.7)] text-base font-normal leading-[22.4px] tracking-[-0.32px] text-center">
        {description}
      </p>
    </article>
  );
};
