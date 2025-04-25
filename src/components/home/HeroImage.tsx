import React from "react";

export const HeroImage: React.FC = () => {
  return (
    <>
      <div className="flex w-full h-[684px] justify-center items-center opacity-30">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/43655697c2b6f00a32fda04e375b72ac9ff21c0c?placeholderIfAbsent=true" alt="Hotel management dashboard" />
      </div>
      <div className="blur-[30px] flex w-[1085px] h-[184px] justify-center items-center opacity-55">
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg width="1039" height="184" viewBox="0 0 1039 184" fill="none" xmlns="http://www.w3.org/2000/svg" class="blur-svg" style="width: 1085px; height: 184px"> <path d="M1007.5 183C1007.5 183 381.739 169.475 262.5 135.5C143.261 101.525 0.5 15 0.5 15L150 50.5L262.5 77L504 88L806.5 50.5L982.5 28.5L1083.5 1V183H1007.5Z" fill="#512FEB" fill-opacity="0.55" stroke="#AAAAAA"></path> </svg>',
            }}
          />
        </div>
      </div>
      <div className="blur-[30px] flex w-[1085px] h-[184px] justify-center items-center opacity-55">
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg width="1039" height="184" viewBox="0 0 1039 184" fill="none" xmlns="http://www.w3.org/2000/svg" class="blur-svg" style="width: 1085px; height: 184px"> <path d="M30.5 1C30.5 1 656.261 14.525 775.5 48.5C894.739 82.475 1037.5 169 1037.5 169L888 133.5L775.5 107L534 96L231.5 133.5L55.5 155.5L-45.5 183V1H30.5Z" fill="#512FEB" fill-opacity="0.55" stroke="#AAAAAA"></path> </svg>',
            }}
          />
        </div>
      </div>
    </>
  );
};
