import { useState } from "react";
import { z } from "zod";
import { MessageCircle, User, Phone, Building, MapPin } from "lucide-react";
import logoImg from "@/assets/Images/Logo.png";

declare function fbq(...args: unknown[]): void;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarTelefone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function formatarCNPJ(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2");
}

function validarCNPJ(cnpj: string): boolean {
  const s = cnpj.replace(/\D/g, "");
  if (s.length !== 14) return false;
  if (/^(\d)\1+$/.test(s)) return false;
  const calc = (len: number) => {
    let sum = 0;
    let w = len - 7;
    for (let i = 0; i < len; i++) {
      sum += parseInt(s[i]) * w--;
      if (w < 2) w = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(s[12]) && calc(13) === parseInt(s[13]);
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxu9fubUQJAekmnmEbvEfuXofW7PEAJ18unuUwyxz-oQ56rF513JSuTihPqq3we77F4Fg/exec";
const CRM_URL = "https://salesyscrm.vercel.app/api/public/leads";
const LEAD_CAPTURE_KEY = "braveo-principal-pixel-001";
const WHATSAPP_NUMBER = "558694271798";

// ─── Schema ──────────────────────────────────────────────────────────────────

const formSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome"),
  telefone: z.string().trim().min(10, "WhatsApp inválido").max(20),
  cnpj: z.string().trim().refine(validarCNPJ, { message: "CNPJ inválido" }),
  estado: z.enum(["MA", "PI"], { errorMap: () => ({ message: "Selecione o estado" }) }),
});

type FormData = z.infer<typeof formSchema>;

function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_content: p.get("utm_content") || "",
    utm_term: p.get("utm_term") || "",
  };
}

function getFbclid() {
  const p = new URLSearchParams(window.location.search);
  return p.get("fbclid") || "";
}

// ─── Component ───────────────────────────────────────────────────────────────

interface LeadFormProps {
  id?: string;
}

const LeadForm = ({ id }: LeadFormProps) => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const value =
      name === "cnpj" ? formatarCNPJ(e.target.value)
      : name === "telefone" ? formatarTelefone(e.target.value)
      : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const data = result.data;
    const utms = getUTMs();

    // 1. Meta Pixel — evento Lead
    try {
      fbq("track", "Lead");
    } catch (_) {
      // pixel não carregado em dev
    }

    const fbclid = getFbclid();

    // 2. Envia para o CRM
    try {
      const crmResponse = await fetch(CRM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadCaptureKey: LEAD_CAPTURE_KEY,
          name: data.nome,
          phone: data.telefone.replace(/\D/g, ""),
          document: data.cnpj.replace(/\D/g, ""),
          documentType: "cnpj",
          state: data.estado,
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign,
          utm_content: utms.utm_content,
          utm_term: utms.utm_term,
          fbclid,
        }),
      });

      const crmData = await crmResponse.json().catch(() => null);

      if (!crmResponse.ok) {
        console.error("CRM lead capture failed", {
          status: crmResponse.status,
          response: crmData,
        });
      } else if (crmData?.duplicate) {
        console.warn("CRM lead already exists", crmData);
      } else {
        console.info("CRM lead created successfully", crmData);
      }
    } catch (error) {
      console.error("CRM lead capture request error", error);
    }

    // 3. Envia para Google Sheets
    // mode: 'no-cors' + Content-Type: 'text/plain' evita preflight
    // que o Apps Script não suporta
    fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.telefone,
        documento: data.cnpj.replace(/\D/g, ""),
        tipoDocumento: "cnpj",
        estado: data.estado,
        fbclid,
        ...utms,
      }),
    }).catch(() => {});

    // 4. Redireciona para WhatsApp
    const msg = encodeURIComponent(
      `🛒 *Interesse em comprar fraldas para revenda!*\n\n` +
        `👤 Nome: ${data.nome}\n` +
        `📱 Telefone: ${data.telefone}\n` +
        `📍 Estado: ${data.estado === "MA" ? "Maranhão" : "Piauí"}\n` +
        `📋 CNPJ: ${data.cnpj}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setIsSubmitting(false);
  };

  const inputBase =
    "w-full rounded-xl border-2 bg-white pl-11 pr-4 py-3 text-sm focus:outline-none transition-all focus:border-primary border-input";

  return (
    <div id={id} className="rounded-2xl shadow-xl border border-border/50 bg-[#ECF3FB] p-6 md:p-8">
      <div className="flex justify-center mb-5">
        <img src={logoImg} alt="Rio Piranhas" className="h-12 md:h-14 object-contain" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center space-y-1 mb-2">
          <h3 className="text-xl font-bold font-display">Receba sua condição comercial</h3>
          <p className="text-sm text-muted-foreground">
            Preencha abaixo e fale com um consultor no WhatsApp
          </p>
        </div>

        {/* Nome */}
        <div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="size-4" />
            </div>
            <input
              name="nome"
              placeholder="Nome do responsável"
              onChange={handleChange}
              required
              className={inputBase}
            />
          </div>
          {errors.nome && <p className="text-destructive text-xs mt-1 ml-1">{errors.nome}</p>}
        </div>

        {/* Telefone */}
        <div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Phone className="size-4" />
            </div>
            <input
              name="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              onChange={handleChange}
              value={formData.telefone ?? ""}
              required
              maxLength={15}
              className={inputBase}
            />
          </div>
          {errors.telefone && <p className="text-destructive text-xs mt-1 ml-1">{errors.telefone}</p>}
        </div>

        {/* CNPJ + Estado */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Building className="size-4" />
              </div>
              <input
                name="cnpj"
                placeholder="00.000.000/0000-00"
                onChange={handleChange}
                value={formData.cnpj ?? ""}
                required
                maxLength={18}
                className={inputBase}
              />
            </div>
            {errors.cnpj && <p className="text-destructive text-xs mt-1 ml-1">{errors.cnpj}</p>}
          </div>
          <div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MapPin className="size-4" />
              </div>
              <select
                name="estado"
                onChange={handleChange}
                defaultValue=""
                required
                className={inputBase}
              >
                <option value="" disabled>Estado</option>
                <option value="PI">Piauí</option>
                <option value="MA">Maranhão</option>
              </select>
            </div>
            {errors.estado && <p className="text-destructive text-xs mt-1 ml-1">{errors.estado}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white font-bold rounded-xl py-3.5 text-base transition-colors disabled:opacity-50"
        >
          <MessageCircle className="size-5" />
          {isSubmitting ? "Enviando..." : "Quero receber condições no WhatsApp"}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          🔒 Exclusivo para empresas com CNPJ no Maranhão e Piauí
        </p>
      </form>
    </div>
  );
};

export default LeadForm;
