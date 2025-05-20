import Link from "next/link";

import CricketSegment from "./components/CricketSegment";
import HomeGridComponent from "./ui/HomeGridComponent";
import HomeNavbar from "./components/HomeNavbar";
import { Metadata } from "next";
import Hero from "./ui/HeroComponent";
import TagComponent from "./components/TagComponent";


export const metadata: Metadata = {
  title: "CrickStory",
  description: "Come and Talk about Cricket  join the community ",
}
export default function Home() {
 ;
  return (
    <main>
      <HomeNavbar/>
      <Hero/>
      <HomeGridComponent/>
      <CricketSegment/>
      <TagComponent/>
    </main>
  );
}