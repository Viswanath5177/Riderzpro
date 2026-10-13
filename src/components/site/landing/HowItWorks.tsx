import React from "react";
import { Bike, ShieldCheck, MapPin } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select your vehicle",
    description: "Saved to My Garage so you only ever browse parts verified for your exact model and voltage.",
    icon: Bike,
  },
  {
    number: "02",
    title: "Get parts that fit",
    description: "We filter and show only compatible batteries, chargers and replacement spares with 100% fitment guarantee.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Delivered and tracked",
    description: "A verified rider brings it straight from the nearest vendor hub, with real-time GPS live tracking.",
    icon: MapPin,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-[#ececec]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]">
            How it works
          </h2>
          <p className="text-base text-[#6b7280] mt-2">
            Three simple steps from selecting your vehicle to live delivery
          </p>
        </div>

        {/* 3 Horizontal Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-7 transition hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-extrabold text-[#e11d2a]">
                      {step.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f7f8] text-[#111111]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#111111]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
