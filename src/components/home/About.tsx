import React from "react";

export const About: React.FC = () => {
  return (
    <section className="flex w-full justify-center items-center px-10 py-[100px]">
      <div className="flex flex-col items-center gap-[60px]">
        <h2 className="text-white text-[50px] font-medium leading-[60px] tracking-[-1px] text-center">
          We are Staywise, we help budget hotels automate their operations,
          engagement, and sales with the power of AI.
        </h2>
      </div>
    </section>
  );
};
