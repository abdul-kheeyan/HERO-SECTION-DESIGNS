import ClothingRailHero from "@/components/ui/product-rail-gallery";
import { RAIL_DEMO_ITEMS } from "@/rail-items";

function App() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background text-foreground">
      <ClothingRailHero
        items={RAIL_DEMO_ITEMS}
        hanger="none"
        eyebrow="The new-season collection"
        heading="Find your look. Make it yours."
        caption="Brush along the rail, slide a hanger, lift a piece to see the back."
        autoplay
        action={
          <button
            type="button"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm outline-none transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            Shop the edit
          </button>
        }
      />
    </main>
  );
}

export default App;
