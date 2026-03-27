import { useEffect, useRef } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  MessageCircle,
  Building2,
  ShieldCheck,
  TrendingUp,
  Store,
  AlertTriangle,
  Baby,
  Box,
  BarChart3,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import heroImage from "@/assets/hero-fraldas.jpg";
import produtosImage from "@/assets/produtos-fraldas.jpg";

const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/558694271798"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 md:hidden bg-[hsl(142,70%,45%)] rounded-full p-4 shadow-2xl hover:scale-105 transition-transform"
    aria-label="Fale no WhatsApp"
  >
    <MessageCircle className="size-7 text-primary-foreground" />
  </a>
);

const CloudDecor = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="60" cy="50" rx="50" ry="28" fill="currentColor" opacity="0.06" />
    <ellipse cx="100" cy="40" rx="60" ry="32" fill="currentColor" opacity="0.04" />
    <ellipse cx="150" cy="50" rx="45" ry="25" fill="currentColor" opacity="0.05" />
  </svg>
);

/* ========== HERO ========== */
const HeroSection = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const search = location.search || "?";
      const vl = encodeURIComponent(location.href);
      iframeRef.current.src = `https://scripts.converteai.net/0b256e8c-1ea0-49a1-a6c2-4aa9d6840568/players/69c5a62c7141a7eb85a249d5/v4/embed.html${search}&vl=${vl}`;
    }
  }, []);

  return (
    <section id="formulario" className="bg-background py-10 md:py-16">
      <div className="container max-w-3xl">

        {/* Badge */}
        <div className="text-center mb-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20">
            Distribuidora oficial para revenda no MA e PI
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold font-display leading-tight text-center mb-3">
          Compre fraldas direto da distribuidora e{" "}
          <span className="text-primary">aumente sua margem</span>{" "}
          no seu comércio
        </h1>

        {/* Subheadline */}
        <p className="text-center text-muted-foreground text-sm md:text-base mb-8 max-w-xl mx-auto">
          As marcas mais vendidas com preço de distribuidor, pedido mínimo de R$250
          e frete grátis para Piauí e Maranhão.
        </p>

        {/* Vídeo */}
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-border mb-8">
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              ref={iframeRef}
              allowFullScreen
              allow="autoplay; fullscreen"
              referrerPolicy="origin"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </div>
        </div>

        {/* Bullets */}
        <ul className="grid sm:grid-cols-2 gap-2 mb-8 max-w-lg mx-auto">
          {[
            "Compra direta da distribuidora",
            "Frete grátis MA e PI",
            "Pedido mínimo de R$250",
            "Exclusivo para CNPJ",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="size-4 text-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Formulário */}
        <LeadForm id="form-hero" />
      </div>
    </section>
  );
};

/* ========== DOR ========== */
const PainSection = () => (
  <section className="py-16 md:py-24 relative">
    <CloudDecor className="absolute top-0 right-10 w-40 text-secondary" />
    <div className="container max-w-3xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-semibold text-secondary-foreground">
        <AlertTriangle className="size-4" />
        Atenção, lojista
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground">
        O problema pode não ser a fralda.{" "}
        <span className="text-primary">Pode ser o fornecedor.</span>
      </h2>
      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
        Se você compra de fornecedor local ou intermediário, sua margem já começa menor antes mesmo do produto chegar no seu estoque.
        No fim do mês, isso impacta diretamente no seu lucro.
      </p>
    </div>
  </section>
);

/* ========== NOVA OPORTUNIDADE ========== */
const OpportunitySection = () => (
  <section className="py-16 md:py-24 bg-[#ECF3FB] relative overflow-hidden">
    <CloudDecor className="absolute -left-10 top-20 w-56 text-primary" />
    <div className="container relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Direto da Distribuidora
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground">
            Agora você pode comprar direto da distribuidora
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A Rio Piranhas atende empresas do Maranhão e Piauí com condição de atacado, sem atravessador e com frete grátis.
            Uma forma mais simples e inteligente de abastecer seu negócio.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Package, text: "Pedido mínimo de R$250" },
              { icon: Truck, text: "Frete grátis MA e PI" },
              { icon: ShieldCheck, text: "Compra direta da distribuidora" },
              { icon: MessageCircle, text: "Atendimento via WhatsApp" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-foreground font-medium">
                <div className="rounded-lg bg-accent p-2">
                  <Icon className="size-4 text-accent-foreground" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          <img
            src={heroImage}
            alt="Distribuição de fraldas"
            className="rounded-2xl shadow-lg"
            width={1024}
            height={768}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

/* ========== PRODUTO ========== */
const ProductSection = () => (
  <section className="py-16 md:py-24 bg-baby-blue/30 relative overflow-hidden">
    <CloudDecor className="absolute right-0 bottom-10 w-52 text-primary" />
    <div className="container relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <img
            src={produtosImage}
            alt="Fraldas para revenda"
            className="rounded-2xl shadow-lg"
            width={1024}
            height={600}
            loading="lazy"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground">
            Fraldas com alto giro para o seu negócio
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Trabalhamos com as marcas mais procuradas pelos consumidores, ajudando seu comércio a vender mais com previsibilidade e margem.
          </p>
          <ul className="space-y-3">
            {[
              { icon: TrendingUp, text: "Marcas com alta demanda" },
              { icon: Store, text: "Ideal para farmácias e mercados" },
              { icon: Box, text: "Compra por caixa" },
              { icon: BarChart3, text: "Reposição fácil de estoque" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-foreground font-medium">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="size-4 text-primary" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

/* ========== BENEFÍCIOS ========== */
const BenefitsSection = () => {
  const benefits = [
    { icon: Package, title: "R$250", desc: "Pedido mínimo acessível" },
    { icon: Truck, title: "Frete grátis", desc: "Entrega no MA e PI" },
    { icon: MessageCircle, title: "WhatsApp", desc: "Atendimento rápido" },
    { icon: Building2, title: "CNPJ", desc: "Condição exclusiva para empresas" },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#ECF3FB] relative overflow-hidden">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground text-center mb-12">
          Condições pensadas para quem revende
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl bg-card border border-border/50 p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                <Icon className="size-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold font-display text-primary">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========== QUALIFICAÇÃO ========== */
const QualificationSection = () => (
  <section className="py-16 md:py-24 bg-[#F8FAFC] relative">
    <CloudDecor className="absolute left-0 top-10 w-44 text-primary" />
    <div className="container max-w-3xl relative z-10">
      <div className="rounded-2xl bg-card border border-border/50 p-8 md:p-12 shadow-sm space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground text-center">
          Essa condição é ideal para quem:
        </h2>
        <ul className="space-y-4 max-w-md mx-auto">
          {[
            "Tem farmácia ou mercadinho",
            "Compra para revenda",
            "Quer melhorar margem",
            "Precisa de fornecedor confiável",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-foreground font-medium">
              <CheckCircle className="size-5 text-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl bg-secondary/15 px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            <Baby className="size-4 inline mr-1 -mt-0.5" />
            Não é indicado para uso pessoal. Atendimento exclusivo para empresas com CNPJ.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ========== RODAPÉ ========== */
const Footer = () => (
  <footer className="bg-foreground py-10">
    <div className="container text-center space-y-3">
      <h3 className="text-xl font-bold font-display text-primary-foreground">
        Rio Piranhas <span className="text-secondary">Distribuidora</span>
      </h3>
      <p className="text-sm text-primary-foreground/70">
        Atendimento para empresas com CNPJ no Maranhão e Piauí
      </p>
      <p className="text-sm text-primary-foreground/70">
        Frete grátis mediante pedido mínimo de R$250
      </p>
    </div>
  </footer>
);

/* ========== PAGE ========== */
const Index = () => (
  <>
    <HeroSection />
    <PainSection />
    <OpportunitySection />
    <ProductSection />
    <BenefitsSection />
    <QualificationSection />
    <Footer />
    <FloatingWhatsApp />
  </>
);

export default Index;