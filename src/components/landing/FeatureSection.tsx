import React from "react";
import FeatureTabs from "./FeatureTabs";
import TestimonialCard from "./TestimonialCard";

interface TestimonialProps {
  logoSrc: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorImageSrc: string;
}

interface FeatureSectionProps {
  iconSrc: string;
  title: string;
  description: string;
  testimonial: TestimonialProps;
  readFullStory?: boolean;
  isLastSection?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  iconSrc,
  title,
  description,
  testimonial,
  readFullStory = false,
  isLastSection = false
}) => {
  return (
    <section className="z-10 pt-16 mt-0 w-full bg-background max-md:max-w-full">
      <div className="flex justify-center items-center pr-36 pl-36 w-full bg-background max-md:px-5 max-md:max-w-full">
        <div className="flex flex-1 shrink self-stretch my-auto basis-0 max-w-[1155px] min-w-60 w-[1155px] max-md:max-w-full">
          <div className="flex flex-col items-center self-start mt-32 max-md:hidden max-md:mt-10">
            <div className="flex overflow-hidden justify-center items-start w-[49px]">
              <img
                src={iconSrc}
                className="object-contain aspect-square w-[49px]"
                alt="Section icon"
              />
            </div>
            <div className="overflow-hidden flex-1 pb-4 w-px pt-[1412px] max-md:pt-24">
              <div className="flex shrink-0 h-[3px]" />
            </div>
          </div>

          <div className="grow shrink-0 pt-32 -mt-4 basis-0 w-fit max-md:pt-24 max-md:max-w-full">
            <div className="pl-10 w-full max-md:pl-5 max-md:max-w-full">
              <h2 className="w-full text-5xl font-bold tracking-tighter leading-[57px] pr-[670px] text-foreground max-md:pr-5 max-md:max-w-full max-md:text-4xl max-md:leading-[52px]">
                {title}
              </h2>
              <p className="pb-px mt-4 max-w-full text-2xl font-medium tracking-tight leading-8 text-foreground/80 w-[480px] max-md:max-w-full">
                {description}
              </p>
            </div>

            <div className="mt-20 w-full min-h-[380px] max-md:mt-10 max-md:max-w-full">
              {!isLastSection ? (
                <FeatureTabs />
              ) : (
                <div className="flex flex-wrap gap-6 items-start w-full">
                  <div className="flex overflow-hidden flex-col flex-1 shrink items-start pt-10 pl-10 bg-background rounded-3xl shadow-sm basis-10 max-w-[684px] min-h-[560px] min-w-60 max-md:max-w-full">
                    <div className="flex flex-wrap gap-1 text-lg tracking-normal leading-snug">
                      <h3 className="flex-auto font-semibold text-foreground">
                        Real-time multiplayer collaboration.
                      </h3>
                      <p className="font-medium text-foreground/80 basis-auto">
                        Collaborate with your
                      </p>
                    </div>
                    <p className="text-lg font-medium tracking-normal leading-6 text-foreground/80 max-md:max-w-full">
                      whole team and nail every task the first time. See each
                      <br />
                      other click, change, and type in real-time.
                    </p>
                    <div className="flex relative flex-col items-end self-stretch pt-36 pr-1 pb-1 pl-20 mt-20 w-full min-h-[366px] max-md:pt-24 max-md:pl-5 max-md:mt-10 max-md:max-w-full">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bcf8bbd422bca9b71b0ceb294a37cf0285fcfe3b?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
                        className="object-cover absolute inset-0 size-full"
                        alt="Collaboration interface"
                      />
                      <div className="flex relative items-start mr-36 max-w-full w-[148px] max-md:mr-2.5">
                        <div className="flex z-0 shrink-0 rounded border border-emerald-500 border-solid h-[37px] w-[148px]" />
                        <div className="flex absolute right-0 -top-4 z-0 shrink-0 h-4 bg-emerald-500 rounded-md w-[38px]" />
                      </div>
                      <div className="flex relative gap-10 items-start mt-28 max-w-full text-xs leading-none text-white whitespace-nowrap w-[454px] max-md:mt-10">
                        <div className="flex relative flex-1 items-start self-start">
                          <div className="flex z-0 shrink-0 rounded border border-cyan-600 border-solid h-[37px] w-[161px]" />
                          <div className="absolute right-0 -top-4 z-0 px-1 pt-0 pb-48 h-4 bg-cyan-600 rounded-md w-[38px] max-md:pb-24">
                            Ethan
                          </div>
                        </div>
                        <div className="flex relative flex-1 items-start self-end mt-9">
                          <div className="flex z-0 shrink-0 rounded border border-violet-600 border-solid h-[37px] w-[147px]" />
                          <div className="absolute right-0 -top-4 z-0 self-stretch px-1.5 bg-violet-600 rounded-md w-[38px]">
                            Anna
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex overflow-hidden flex-col flex-1 shrink items-center px-10 pt-10 pb-5 max-w-md bg-background rounded-3xl shadow-sm basis-0 min-w-60 max-md:px-5 max-md:max-w-full">
                    <div className="px-0.5 pb-16 w-full text-lg tracking-normal max-w-[420px]">
                      <div className="flex z-10 gap-1 leading-snug">
                        <h3 className="grow font-semibold text-foreground">
                          Build from anywhere.
                        </h3>
                        <p className="grow shrink w-36 font-medium text-foreground/80">
                          Our world-class apps
                        </p>
                      </div>
                      <p className="font-medium leading-6 text-foreground/80 max-md:mr-2">
                        let you collaborate from anywhere without
                        <br />
                        compromising your workflow.
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
              )}

              <TestimonialCard
                logoSrc={testimonial.logoSrc}
                quote={testimonial.quote}
                authorName={testimonial.authorName}
                authorRole={testimonial.authorRole}
                authorImageSrc={testimonial.authorImageSrc}
                readFullStory={readFullStory}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection; 