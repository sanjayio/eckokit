"use client"

import Image from "next/image";


interface LogoProps {
  currentView: string
  image: string | null
}

export default function Logo({ currentView, image }: LogoProps) {

  return (
    <Image
      src={currentView === "user" ? "/ticket_planet_logo.png" : image ?? "/ticket_planet_logo.png"}
      width={30}
      height={30}
      className="me-1 rounded-[5px] transition-all group-data-collapsible:size-7 group-data-[collapsible=icon]:size-8"
      alt="shadcn ui kit logo"
      unoptimized
    />
  );
}
