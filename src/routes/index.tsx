import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Mentor } from "@/components/landing/Mentor";
import { DashboardMock } from "@/components/landing/DashboardMock";
import { Method } from "@/components/landing/Method";
import { Qualification } from "@/components/landing/Qualification";
import { Formations } from "@/components/landing/Formations";
import { LeadMagnet } from "@/components/landing/LeadMagnet";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "J Forex Academy — Devenez un trader discipliné et rentable" },
      {
        name: "description",
        content:
          "Formation premium au trading Forex : méthode SMC, ICT, gestion de risque institutionnelle et coaching live pour des traders constants.",
      },
      { property: "og:title", content: "J Forex Academy" },
      {
        property: "og:description",
        content:
          "L'académie pour bâtir une méthode disciplinée et durable. SMC, ICT, gestion de risque, psychologie, coaching live.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Mentor />
        <DashboardMock />
        <Method />
        <Qualification />
        <Formations />
        <LeadMagnet />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
