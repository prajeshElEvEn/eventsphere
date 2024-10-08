import { EventCard } from "@/components/event-card";
import HeaderMenu from "@/components/header-menu";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Category from "@/components/category";
import { useEffect, useState } from "react";
import { getCurrentLocation } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useQuery(api.events.getCategories);
  const events = useQuery(api.events.get, {
    currentLat: coords.lat,
    currentLon: coords.lon,
  });

  const categoryEvents = useQuery(api.events.getEventsByCategory, {
    category: selectedCategory || "",
    currentLat: coords.lat,
    currentLon: coords.lon,
  });

  useEffect(() => {
    async function fetchLocation() {
      try {
        const currentPosition = await getCurrentLocation();
        setCoords({
          lat: currentPosition.coords.latitude,
          lon: currentPosition.coords.longitude,
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchLocation();
  }, []);

  function handleCategory(category: string): void {
    setSelectedCategory(category);
  }

  const eventsToDisplay = selectedCategory ? categoryEvents : events;

  return (
    <div className="flex flex-grow flex-col gap-4">
      <HeaderMenu />
      <Input type="text" placeholder="Search..." />
      <div className="h-10 snap-x scroll-auto flex gap-2 py-2 overflow-x-auto">
        <Category
          category={"All"}
          onBadgeClick={() => setSelectedCategory(null)}
        />
        <Separator orientation="vertical" />
        {categories?.map((category) => (
          <Category
            key={category}
            category={category}
            onBadgeClick={() => void handleCategory(category)}
          />
        ))}
      </div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Events
      </h1>
      <div className="flex flex-col gap-4">
        {eventsToDisplay?.map((event) => (
          <EventCard key={event?._id} event={event} coords={coords} /> // Add key for list rendering
        ))}
      </div>
    </div>
  );
}
