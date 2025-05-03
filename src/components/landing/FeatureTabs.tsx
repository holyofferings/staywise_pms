import React, { useState } from "react";

const FeatureTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    {
      id: 0,
      title: "Guest Management",
      description: "Easily track guest details and preferences",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bcf8bbd422bca9b71b0ceb294a37cf0285fcfe3b?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    },
    {
      id: 1,
      title: "Room Inventory",
      description: "Real-time view of available rooms and cleaning status",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bcf8bbd422bca9b71b0ceb294a37cf0285fcfe3b?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    },
    {
      id: 2,
      title: "Booking Management",
      description: "Streamline the entire booking process",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bcf8bbd422bca9b71b0ceb294a37cf0285fcfe3b?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground/70 hover:text-foreground"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 items-start w-full">
        <div className="flex overflow-hidden flex-col flex-1 shrink items-start pt-10 pl-10 bg-background rounded-3xl shadow-sm basis-10 max-w-[684px] min-h-[560px] min-w-60 max-md:max-w-full">
          <h3 className="flex-auto font-semibold text-lg tracking-normal leading-snug text-foreground">
            {tabs[activeTab].title}
          </h3>
          <p className="text-lg font-medium tracking-normal leading-6 text-foreground/80 mt-2 mb-6 max-md:max-w-full">
            {tabs[activeTab].description}
          </p>
          <div className="flex relative flex-col items-end self-stretch pt-36 pr-1 pb-1 pl-20 mt-10 w-full min-h-[366px] max-md:pt-24 max-md:pl-5 max-md:max-w-full">
            <img
              src={tabs[activeTab].image}
              className="object-cover absolute inset-0 size-full"
              alt={tabs[activeTab].title}
            />
          </div>
        </div>
        <div className="flex overflow-hidden flex-col flex-1 shrink items-center px-10 pt-10 pb-5 max-w-md bg-background rounded-3xl shadow-sm basis-0 min-w-60 max-md:px-5 max-md:max-w-full">
          <div className="px-0.5 pb-16 w-full text-lg tracking-normal max-w-[420px]">
            <h3 className="grow font-semibold text-foreground">
              Mobile Access
            </h3>
            <p className="font-medium leading-6 text-foreground/80 mt-2">
              Access your hotel management system from anywhere, 
              allowing you to stay connected with your operations.
            </p>
          </div>
          <div className="overflow-hidden max-w-full w-[258px]">
            <div className="flex relative flex-col w-full aspect-[0.705]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/11dd7bc85525a8758a456d0a07553b476774b032?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
                className="object-cover absolute inset-0 size-full"
                alt="Mobile app interface"
              />
              <div className="flex relative flex-col px-1.5 pt-32 w-full aspect-[0.705] max-md:pt-24">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a170c5ac21e9401860383b59d57be2efe195cc23?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
                  className="object-cover absolute inset-0 size-full"
                  alt="Mobile app background"
                />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/54f18acd73e3c66f89d074bd00718e91f06fee1c?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
                  className="object-contain w-full aspect-[1.06]"
                  alt="Mobile app screen"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTabs; 